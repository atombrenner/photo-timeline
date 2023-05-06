import { readJSONSync, removeSync, writeJSONSync } from 'fs-extra'
import { join } from 'node:path'
import { FromTo, moveFile, renameFile } from './filesystem'
import { MediaFile } from './media-files'
import { MakePathName } from './names'

const getIndexFileName = (rootPath: string) => join(rootPath, 'index.json')

export const readIndex = async (
  rootPath: string,
  makeRelativePathName: MakePathName,
): Promise<MediaFile[]> => {
  const makePathName = (timestamp: number) => join(rootPath, makeRelativePathName(timestamp))
  const index = readJSONSync(getIndexFileName(rootPath))
  for (let i = index.length; i-- > 0; ) {
    const timestamp = index[i]
    index[i] = { path: makePathName(timestamp), timestamp } satisfies MediaFile
  }
  return index
}

export const organize = async (
  files: MediaFile[],
  rootPath: string,
  makeRelativePathName: MakePathName,
) => {
  const makePathName = (timestamp: number) => join(rootPath, makeRelativePathName(timestamp))

  // sort files by timestamp and add sequence number as fraction (mutates files array)
  organizeByTimestamp(files)
  const { renameOps, moveOps } = calcMoveFileOps(files, makePathName)

  // remove index, so we don't have inconsistent data during file movements
  const indexFileName = getIndexFileName(rootPath)
  removeSync(indexFileName)
  // rename conflicting files before moving
  await Promise.all(renameOps.map(renameFile))
  // files must not be moved until conflicting files are renamed
  await Promise.all(moveOps.map(moveFile))

  // as a last step, write the new index
  const index = files.map(({ timestamp }) => timestamp)
  writeJSONSync(indexFileName, index)
  console.log(`wrote ${index.length} entries to ${indexFileName}`)
}

// sorts an array of items by its timestamp property
// and create a sequence number as a fraction for
// multiple items in the same second
// for performance reasons the array and timestamp are mutated in place
export const organizeByTimestamp = (items: MediaFile[]): void => {
  // for robustness, remove all fractions from timestamps before processing
  for (let i = items.length; i-- > 0; ) {
    const item = items[i]
    item.timestamp = Math.trunc(item.timestamp)
  }

  // sort by full timestamp
  items.sort((a, b) => a.timestamp - b.timestamp)

  // add sequence number as fraction if timestamps are in the same second
  for (let i = items.length - 1; i > 0; ) {
    const stop = i
    const currentSecond = toSeconds(items[stop].timestamp)
    do i--
    while (i >= 0 && toSeconds(items[i].timestamp) === currentSecond)
    const count = stop - i
    if (count > 1) {
      if (count > 99) throw Error('too many timestamps per second')
      for (let seq = 1; seq <= count; ++seq) {
        // add sequence number j as a two digit fraction
        items[i + seq].timestamp += seq / 100
      }
    }
  }
}

export const toSeconds = (timestamp: number) => Math.trunc(timestamp / 1000)

export const calcMoveFileOps = (files: MediaFile[], makePathName: MakePathName) => {
  const targets = new Set<string>()

  const moveOps: FromTo[] = []
  for (const file of files) {
    const path = makePathName(file.timestamp)
    if (path !== file.path) {
      moveOps.push({ from: file.path, to: path })
      targets.add(path)
    }
  }

  // temporary rename files which have a path that is the target of another file
  const renameOps: FromTo[] = []
  for (const move of moveOps) {
    if (targets.has(move.from)) {
      const tmpPath = '__' + move.from
      renameOps.push({ from: move.from, to: tmpPath })
      move.from = tmpPath
    }
  }

  return { renameOps, moveOps }
}
