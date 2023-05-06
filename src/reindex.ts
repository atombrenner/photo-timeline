import { join } from 'node:path'
import { removeEmptyFolders } from './filesystem'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from './media-files'
import { MakePathName, makePhotoPathName, makeVideoPathName } from './names'
import { organize } from './organize'

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
  await organize(files, rootPath, makePathName)
}
