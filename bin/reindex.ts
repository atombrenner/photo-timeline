#!/usr/bin/env -S npx ts-node -T

import { parseArgv } from 'lib/args'
import { mediaRootPath } from 'lib/config'
import { removeEmptyFolders } from 'lib/filesystem'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from 'lib/media-files'
import { MakePathName, makePhotoPathName, makeVideoPathName } from 'lib/names'
import { organize } from 'lib/organize'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

async function main() {
  const { args, photos, videos, help } = parseArgv(process.argv)

  if (help) {
    console.log('npx reindex [mediaRootPath] [--photos] [--videos]')
    return
  }

  const rootPath = args[0] || mediaRootPath
  if (!existsSync(rootPath)) {
    throw Error(`mediaRootPath '${rootPath}' does not exist`)
  }

  if (photos) {
    const photoRootPath = join(rootPath, 'Photos')
    await reindex(photoRootPath, readPhotoFiles, makePhotoPathName)
  }

  if (videos) {
    const videoRootPath = join(rootPath, 'Videos')
    await reindex(videoRootPath, readVideoFiles, makeVideoPathName)
  }
}

const reindex = async (rootPath: string, readFiles: ReadMediaFiles, makePathName: MakePathName) => {
  if (!existsSync(rootPath)) {
    mkdirSync(rootPath)
  }
  const files = await readFiles(rootPath)
  await organize(files, rootPath, makePathName)
  await removeEmptyFolders(rootPath)
}

main().catch((err) => {
  console.error(`${err}`)
  process.exit(1)
})
