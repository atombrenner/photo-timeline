import { join } from 'path'
import { move, mkdirs, fstatSync, statSync } from 'fs-extra'
import {
  readMediaFiles,
  calcMoveCommands,
  groupByFolder,
  mergeFolder,
  assertAllFilesInSameFolder,
  MediaFile,
} from './organize'
import { readPhotoCreationDate, readFiles, readVideoCreationDate } from './read'
import { format, toDate } from 'date-fns'

// const rootFolder = `/home/christian/Photos`

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

async function importMedia(from: string, rootFolder: string, readMediaFiles: ReadMediaFiles) {
  // put generic import here
  const files = await readMediaFiles(from)
  const grouped = await groupByFolder(files)

  await Promise.all(
    Object.entries(grouped).map(async ([folder, files]) => {
      const folderPath = join(rootFolder, folder)
      await mkdirs(folderPath) // if folder does not exist, create it
      const existingFiles = await readMediaFiles(folderPath)
      const organizedFiles = mergeFolder(files, existingFiles)
      assertAllFilesInSameFolder(organizedFiles)
      // TODO: (over)writeJson(join(folderPath, 'index.json'))
      for (const { from, to } of calcMoveCommands(organizedFiles, rootFolder)) {
        console.log(`move ${from} ${to}`)
        //await move(from, to)
      }
    }),
  )
}

const importPhotos = () => importMedia('/home/christian/DCIM', `/home/christian/Photos`, readPhotos)

importPhotos().then(console.info).catch(console.error)
