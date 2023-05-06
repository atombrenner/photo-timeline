#!/usr/bin/env -S npx ts-node -T

import { join } from 'node:path'
import { removeEmptyFolders } from 'lib/filesystem'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from 'lib/media-files'
import { MakePathName, makePhotoPathName, makeVideoPathName } from 'lib/names'
import { organize } from 'lib/organize'

async function main() {
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

main().catch(console.error)
