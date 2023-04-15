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
import { readFiles, readFolders } from './read'
import { readPhotoCreationDate, readVideoCreationDate } from './read-creation-date'

type ReadMediaFiles = (folder: string) => Promise<MediaFile[]>

async function readPhotos(folder: string) {
  const files = await readFiles(folder, PhotoPattern)
  return await readMediaFiles(files, readPhotoCreationDate, makePhotoFolderName)
}

async function readVideos(folder: string) {
  const files = await readFiles(folder, VideoPattern)
  return await readMediaFiles(files, readVideoCreationDate, makeVideoFolderName)
}

export async function removeEmptyFolder(folder: string): Promise<void> {
  console.log(`remove ${folder}`)
  await remove(folder)
}

export async function moveFile(from: string, to: string): Promise<void> {
  console.log(`move ${from} -> ${to}`)
  await move(from, to, { overwrite: false })
}

/** remove all folders without mediafiles in folder */
export async function removeFoldersWithoutMediaFiles(folder: string) {
  const folders = await readFolders(folder)
  await Promise.all(folders.map(removeFoldersWithoutMediaFiles))
  const entries = await readFiles(folder, MediaPattern)
  if (entries.length === 0) {
    await removeEmptyFolder(folder)
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
        await moveFile(from, to)
      }
    }),
  )
}

async function ingest(source: string) {
  await ingestMedia(source, PhotoRoot, readPhotos)
  await ingestMedia(source, VideoRoot, readVideos)
  await removeFoldersWithoutMediaFiles(source)
}

async function reindex() {
  await ingestMedia(PhotoRoot, PhotoRoot, readPhotos)
  await ingestMedia(VideoRoot, VideoRoot, readVideos)
}

if (require.main === module) {
  const source = process.argv[2]
  const promise = source === 'reindex' ? reindex() : ingest(source)
  promise.then(createPhotoAndVideoIndex).catch(console.error)
}
