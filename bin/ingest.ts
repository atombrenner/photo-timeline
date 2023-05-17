#!/usr/bin/env -S npx ts-node -T

import { ingestSources, mediaRootPath } from 'lib/config'
import { removeEmptyFolders } from 'lib/filesystem'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from 'lib/media-files'
import { MakeMediaFilePath, makePhotoFilePath, makeVideoFilePath } from 'lib/names'
import { organize } from 'lib/organize'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { parseArgv } from 'lib/args'
import { readIndex, writeIndex } from 'lib/media-index'

async function main() {
  const { args, photos, videos, help } = parseArgv(process.argv)
  if (help) {
    console.log('npx ingest <source> [mediaRootFolder] [--photos] [--videos]')
    return
  }

  if (args.length === 0) {
    throw Error('missing ingest source argument')
  }

  const source = getIngestSource(args[0].toLowerCase())
  if (!existsSync(source)) {
    throw Error(
      `source '${source}' does not exist, configured sources are:\n- ${Object.keys(
        ingestSources,
      ).join('\n- ')}`,
    )
  }

  const rootPath = args[1] ?? mediaRootPath
  if (!existsSync(rootPath)) {
    throw Error(`mediaRootPath '${rootPath}' does not exist`)
  }

  if (photos) {
    const photoRootPath = join(rootPath, 'Photos')
    await ingest(photoRootPath, source, readPhotoFiles, makePhotoFilePath)
  }

  if (videos) {
    const videoRootPath = join(rootPath, 'Videos')
    await ingest(videoRootPath, source, readVideoFiles, makeVideoFilePath)
  }

  // clean source
  await removeEmptyFolders(source)
}

const getIngestSource = (arg: string) =>
  arg in ingestSources ? ingestSources[arg as keyof typeof ingestSources] : arg

const ingest = async (
  rootPath: string,
  source: string,
  readFiles: ReadMediaFiles,
  makeFilePath: MakeMediaFilePath,
) => {
  if (!existsSync(rootPath)) {
    mkdirSync(rootPath)
    await writeIndex(rootPath, [])
  }
  const [fromIndex, fromSource] = await Promise.all([readIndex(rootPath), readFiles(source)])
  const files = fromIndex.concat(fromSource)
  await organize(files, rootPath, makeFilePath)
}

main().catch((err) => {
  console.error(`${err}`)
  process.exit(1)
})
