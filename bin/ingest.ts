#!/usr/bin/env -S npx ts-node -T

import { ingestSources, mediaRootPath } from 'lib/config'
import { removeEmptyFolders } from 'lib/filesystem'
import { ReadMediaFiles, readPhotoFiles, readVideoFiles } from 'lib/media-files'
import { MakePathName, makePhotoPathName, makeVideoPathName } from 'lib/names'
import { organize, readIndex } from 'lib/organize'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { parseArgv } from 'lib/args'

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
    await ingest(photoRootPath, source, readPhotoFiles, makePhotoPathName)
  }

  if (videos) {
    const videoRootPath = join(rootPath, 'Videos')
    await ingest(videoRootPath, source, readVideoFiles, makeVideoPathName)
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
  makePathName: MakePathName,
) => {
  if (!existsSync(rootPath)) {
    mkdirSync(rootPath)
  }
  const [indexFiles, sourceFiles] = await Promise.all([
    readIndex(rootPath, makePathName),
    readFiles(source),
  ])
  const files = indexFiles.concat(sourceFiles)
  await organize(files, rootPath, makePathName)
}

main().catch((err) => {
  console.error(`${err}`)
  process.exit(1)
})
