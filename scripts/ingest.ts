import { move, mkdirp, remove } from 'fs-extra'
import { join } from 'path'
import { MediaPattern, PhotoPattern, PhotoRoot, VideoPattern, VideoRoot } from './config'
import { createPhotoAndVideoIndex } from './create-index'
import { makePhotoFolderName, makeVideoFolderName } from './names'
import {
  readMediaFiles,
  calcMoveCommands,
  groupByFolder,
  mergeFilesInFolder,
  assertAllFilesHaveSameFolder,
  MediaFile,
} from './organize'
import { readPhotoCreationDate, readVideoCreationDate, readFiles, readFolders } from './read'

type ReadMediaFiles = (folder: string) => Promise<MediaFile[]>

async function readPhotos(folder: string) {
  const files = await readFiles(folder, PhotoPattern)
  return await readMediaFiles(files, readPhotoCreationDate, makePhotoFolderName)
}

async function readVideos(folder: string) {
  const files = await readFiles(folder, VideoPattern)
  return await readMediaFiles(files, readVideoCreationDate, makeVideoFolderName)
}

/** remove all folders without mediafiles in folder */
export async function removeFoldersWithoutMediaFiles(folder: string) {
  const folders = await readFolders(folder)
  await Promise.all(folders.map(removeFoldersWithoutMediaFiles))
  const entries = await readFiles(folder, MediaPattern)
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
  await removeFoldersWithoutMediaFiles(from)
}

async function ingest(source: string) {
  await ingestMedia(source, PhotoRoot, readPhotos)
  await ingestMedia(source, VideoRoot, readVideos)
}

async function reindex() {
  await ingest(PhotoRoot)
  await ingest(VideoRoot)
}

if (require.main === module) {
  const source = process.argv[2]
  const promise = source === 'reindex' ? reindex() : ingest(source)
  promise.then(createPhotoAndVideoIndex).catch(console.error)
}
