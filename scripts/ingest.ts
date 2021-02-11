import { join } from 'path'
import { move, mkdirp } from 'fs-extra'
import {
  readMediaFiles,
  calcMoveCommands,
  groupByFolder,
  mergeFilesInFolder,
  assertAllFilesHaveSameFolder,
  MediaFile,
} from './organize'
import { readPhotoCreationDate, readFiles, readVideoCreationDate } from './read'

interface ReadMediaFiles {
  (folder: string): Promise<MediaFile[]>
}

async function readPhotos(folder: string) {
  const pattern = /\.jpe?g$/i
  return await readMediaFiles(await readFiles(folder, pattern), readPhotoCreationDate)
}

async function readVideos(folder: string) {
  const pattern = /\.mp4$/i
  return await readMediaFiles(await readFiles(folder, pattern), readVideoCreationDate)
}

async function ingestMedia(from: string, rootFolder: string, readMediaFiles: ReadMediaFiles) {
  const files = await readMediaFiles(from)
  const grouped = await groupByFolder(files)

  await Promise.all(
    Object.entries(grouped).map(async ([folder, files]) => {
      const folderPath = join(rootFolder, folder)
      console.log(folderPath)
      await mkdirp(folderPath) // if folder does not exist, create it
      const filesInTargetFolder = await readMediaFiles(folderPath)
      const mergedFiles = mergeFilesInFolder(files, filesInTargetFolder)
      assertAllFilesHaveSameFolder(mergedFiles)
      for (const { from, to } of calcMoveCommands(mergedFiles, rootFolder)) {
        await move(from, to)
        console.log(`moved ${from} -> ${to}`)
      }
    }),
  )
}

const ingestPhotos = () => ingestMedia('/home/christian/DCIM', '/home/christian/Photos', readPhotos)
const ingestVideos = () => ingestMedia('/home/christian/DCIM', '/home/christian/Videos', readVideos)

ingestVideos().then(console.info).catch(console.error)
