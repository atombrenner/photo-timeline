import { readExifData } from '@atombrenner/exif-reader-jpeg'
import { ffprobe } from './ffprobe'
import { listFiles } from './filesystem'
import { MediaFile } from './media-file'

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
  const metadata = await readExifData(file)
  const ms = Number('0.' + (metadata.exif?.SubSecTimeOriginal || '0')) * 1000
  const parsedTime = (metadata.exif?.DateTimeOriginal ?? metadata.image?.ModifyDate)?.getTime()
  if (!parsedTime) throw Error('cannot read photo timestamp for ' + file)
  return Math.trunc(parsedTime + ms)
}

export const readVideoTimestamp: ReadTimestamp = async (file) => {
  // ideally get it from mp4 container without having to use ffprobe
  const { created } = await ffprobe(file) // works for avi, mp4, mov
  if (isNaN(created)) throw Error('cannot read video timestamp for ' + file)
  return Math.trunc(created)
}
