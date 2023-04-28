import parseExif from 'exif-reader'
import sharp from 'sharp'
import { ffprobe } from './ffprobe'
import { PhotoPattern, VideoPattern } from './config'
import { listFiles } from './filesystem'

export type MediaFile = {
  path: string
  timestamp: number
}

export type ReadMediaFiles = (rootPath: string) => Promise<MediaFile[]>

export type ReadTimestamp = (path: string) => Promise<number>

export const readPhotoFiles = async (rootPath: string): Promise<MediaFile[]> => {
  const files = await listFiles(rootPath, PhotoPattern)
  console.log(`found ${files.length} photos in ${rootPath}`)
  const photos = await readTimestamps(files, readPhotoTimestamp)
  console.log(`read ${photos.length} photo timestamps`)
  return photos
}

export const readVideoFiles = async (rootPath: string): Promise<MediaFile[]> => {
  const files = await listFiles(rootPath, VideoPattern)
  console.log(`found ${files.length} videos in ${rootPath}`)
  const videos = await readTimestamps(files, readVideoTimestamp)
  console.log(`read ${videos.length} videos timestamps`)
  return videos
}

const readTimestamps = (files: string[], readTimestamp: ReadTimestamp) =>
  Promise.all(files.map(async (path) => ({ path, timestamp: await readTimestamp(path) })))

export const readPhotoTimestamp: ReadTimestamp = async (path) => {
  const metadata = await sharp(path).metadata()
  if (!metadata.exif) throw Error(`no exif metadata in ${path}`)
  const parsed = parseExif(metadata.exif)
  const ms = Number('0.' + (parsed.exif?.SubSecTimeOriginal || '0')) * 1000
  const created = Number(parsed.exif?.DateTimeOriginal || parsed.image?.ModifyDate || 0) + ms
  if (created < 1) throw Error('Cannot read photo timestamp for ' + path)
  return created
}

export const readVideoTimestamp: ReadTimestamp = async (path) => {
  // ideally get it from mp4 container without having to use ffrobe
  const { created } = await ffprobe(path) // works for avi, mp4, mov
  if (!isNaN(created)) return created
  throw Error('Cannot read video timestamp for ' + path)
}
