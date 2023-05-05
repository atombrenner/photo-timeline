import parseExif from 'exif-reader'
import sharp from 'sharp'
import { ffprobe } from './ffprobe'
import { listFiles } from './filesystem'

export type MediaFile = {
  path: string
  timestamp: number
}

export type ReadMediaFiles = (folder: string) => Promise<MediaFile[]>

export type ReadTimestamp = (file: string) => Promise<number>

export const readPhotoFiles = async (folder: string): Promise<MediaFile[]> =>
  readMediaFiles(folder, 'photos', /\.jpe?g$/i, readPhotoTimestamp)

export const readVideoFiles = async (folder: string): Promise<MediaFile[]> =>
  readMediaFiles(folder, 'videos', /\.mp4$/i, readVideoTimestamp)

const readMediaFiles = async (
  folder: string,
  type: string,
  pattern: RegExp,
  readTimestamp: ReadTimestamp,
): Promise<MediaFile[]> => {
  const paths = await listFiles(folder, pattern)
  console.log(`found ${paths.length} ${type} in ${folder}`)
  const mediaFiles = await Promise.all(
    paths.map(async (path) => ({ path, timestamp: await readTimestamp(path) })),
  )
  console.log(`read timestamp from ${mediaFiles.length} ${type} files`)
  return mediaFiles
}

export const readPhotoTimestamp: ReadTimestamp = async (file) => {
  const metadata = await sharp(file).metadata()
  if (!metadata.exif) throw Error(`no exif metadata in ${file}`)
  const parsed = parseExif(metadata.exif)
  const ms = Number('0.' + (parsed.exif?.SubSecTimeOriginal || '0')) * 1000
  const timestamp = Number(parsed.exif?.DateTimeOriginal || parsed.image?.ModifyDate || 0) + ms
  if (timestamp < 1) throw Error('cannot read photo timestamp for ' + file)
  return Math.trunc(timestamp)
}

export const readVideoTimestamp: ReadTimestamp = async (file) => {
  // ideally get it from mp4 container without having to use ffprobe
  const { created } = await ffprobe(file) // works for avi, mp4, mov
  if (isNaN(created)) throw Error('cannot read video timestamp for ' + file)
  return Math.trunc(created)
}
