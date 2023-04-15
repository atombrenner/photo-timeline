import parseExif from 'exif-reader'
import sharp from 'sharp'
import { ffprobe } from './ffprobe'

export type ReadCreationDate = (path: string) => Promise<number>

export const readPhotoCreationDate: ReadCreationDate = async (path) => {
  const metadata = await sharp(path).metadata()
  if (!metadata.exif) throw Error(`no exif metadata in ${path}`)
  const parsed = parseExif(metadata.exif)
  const ms = Number('0.' + (parsed.exif?.SubSecTimeOriginal || '0')) * 1000
  const created = Number(parsed.exif?.DateTimeOriginal || parsed.image?.ModifyDate || 0) + ms
  if (created < 1) throw Error('Cannot get image creation date for ' + path)
  return created
}

export const readVideoCreationDate: ReadCreationDate = async (path) => {
  // ideally get it from mp4 container
  const { created } = await ffprobe(path) // works for avi, mp4, mov
  if (!isNaN(created)) return created
  throw Error('Cannot get video creation date for ' + path)
}
