import { join } from 'path'
import { move, mkdirp, remove } from 'fs-extra'
import {
  readMediaFiles,
  calcMoveCommands,
  groupByFolder,
  mergeFilesInFolder,
  assertAllFilesHaveSameFolder,
  MediaFile,
} from './organize'
import { readPhotoCreationDate, readVideoCreationDate, readFiles, readFolders } from './read'

const shouldRemoveEmptyFolder = true

const photoPattern = /\.jpe?g$/i
const videoPattern = /\.(mp4|mov|avi|wmv)$/i

// TODO: how to prevent exporting from direct callable scripts?
export const mediaPattern = /\.(jpe?g|mp4|mov|avi|wmv)$/i

interface ReadMediaFiles {
  (folder: string): Promise<MediaFile[]>
}

async function readPhotos(folder: string) {
  return await readMediaFiles(await readFiles(folder, photoPattern), readPhotoCreationDate)
}

async function readVideos(folder: string) {
  return await readMediaFiles(await readFiles(folder, videoPattern), readVideoCreationDate)
}

async function removeEmptyFolders(folder: string) {
  const folders = await readFolders(folder)
  await Promise.all(folders.map(removeEmptyFolders))
  const entries = await readFiles(folder, mediaPattern)
  if (entries.length === 0) {
    console.log(`remove ${folder}`)
    await remove(folder)
  }
}

async function ingestMedia(from: string, rootFolder: string, readMediaFiles: ReadMediaFiles) {
  const files = await readMediaFiles(from)
  const grouped = await groupByFolder(files)

  await Promise.all(
    Object.entries(grouped).map(async ([folder, files]) => {
      const folderPath = join(rootFolder, folder)
      await mkdirp(folderPath) // if folder does not exist, create it
      const filesInTargetFolder = await readMediaFiles(folderPath)
      const mergedFiles = mergeFilesInFolder(files, filesInTargetFolder)
      assertAllFilesHaveSameFolder(mergedFiles)
      for (const { from, to } of calcMoveCommands(mergedFiles, rootFolder)) {
        console.log(`move ${from} -> ${to}`)
        await move(from, to)
      }
    }),
  )
  // not easy do dry run because it depends on files being moved
  if (shouldRemoveEmptyFolder) await removeEmptyFolders(from)
}

if (require.main === module) {
  const ingestPhotos = () =>
    ingestMedia('/home/christian/Photos/2021', '/home/christian/Photos', readPhotos)

  const ingestVideos = () =>
    ingestMedia('/home/christian/DCIM', '/home/christian/Videos', readVideos)

  // called via import
  ingestPhotos().then(console.info).catch(console.error)
}
