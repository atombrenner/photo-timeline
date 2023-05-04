import { join } from 'node:path'
import { organizeMediaFiles } from './organize'
import { MakePathName, makePhotoPathName, makeVideoPathName } from './names'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from './media-files'
import { removeEmptyFolders } from './filesystem'

console.log('reindex', process.argv.slice(2))

export const reindexCommand = async () => {
  // figure out if we want to specify the folder of the index
  const rootPath = '/home/christian/TestMedia'

  // Photos
  const photoRootPath = join(rootPath, 'Photos')
  await reindex(photoRootPath, readPhotoFiles, makePhotoPathName)

  // Videos
  const videoRootPath = join(rootPath, 'Videos')
  await reindex(videoRootPath, readVideoFiles, makeVideoPathName)

  await removeEmptyFolders(rootPath)
}

const reindex = async (rootPath: string, readFiles: ReadMediaFiles, makePathName: MakePathName) => {
  const files = await readFiles(rootPath)
  await organizeMediaFiles(files, rootPath, makePathName)
}

export const ingest = async (source: string, rootPath: string) => {
  // Pseudo Code
  // 1. Ingest Photos
  // const photos: TimestampedFiles = readIndex from json and dehydrate (remove fractions)
  // const newPhotos = readPhotoFiles(source)
  // photos.concat(newPhotos)
  // organizeMediaFiles(photos, getPhotoTimestamp)
  // 2. Ingest Videos
  // ...
  // 3. Clean source (delete all empty folders)
  //    list files to clean and ask user for permission
}
