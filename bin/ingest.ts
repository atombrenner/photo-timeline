#!/usr/bin/env -S npx ts-node -T

import { join } from 'node:path'
import { removeEmptyFolders } from '../src/filesystem'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from '../src/media-files'
import { MakePathName, makePhotoPathName, makeVideoPathName } from '../src/names'
import { organize, readIndex } from '../src/organize'

async function main() {
  const args = process.argv.slice(2)
  const source = '/home/christian/TestCamera' //  args[0]
  const rootPath = '/home/christian/TestMedia'

  // Photos
  const photoRootPath = join(rootPath, 'Photos')
  await ingest(photoRootPath, source, readPhotoFiles, makePhotoPathName)

  // Videos
  const videoRootPath = join(rootPath, 'Videos')
  await ingest(videoRootPath, source, readVideoFiles, makeVideoPathName)

  // clean source
  await removeEmptyFolders(source)
}

const ingest = async (
  rootPath: string,
  source: string,
  readFiles: ReadMediaFiles,
  makePathName: MakePathName,
) => {
  const [indexFiles, sourceFiles] = await Promise.all([
    readIndex(rootPath, makePathName),
    readFiles(source),
  ])
  const files = indexFiles.concat(sourceFiles)
  await organize(files, rootPath, makePathName)
}

main().catch(console.error)
