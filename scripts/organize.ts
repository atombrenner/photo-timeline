import { join } from 'node:path'
import fs from 'fs-extra'
import { FromTo, moveFile, renameFile } from './filesystem'
import { MediaFile } from './media-files'
import { MakePathName } from './names'

export const organizeMediaFiles = async (
  files: MediaFile[],
  rootPath: string,
  makePathName: MakePathName,
) => {
  // sort by timestamp and add sequence if same second
  organizeByTimestamp(files)
  const makeRootPathName = (timestamp: number) => join(rootPath, makePathName(timestamp))
  const { renameOps, moveOps } = calcMoveFileOps(files, makeRootPathName)

  const indexFileName = join(rootPath, 'index.json')

  // remove index, so we don't have inconsistent data during file movements
  fs.removeSync(indexFileName)
  // rename conflicting files before moving
  await Promise.all(renameOps.map(renameFile))
  // files must not be moved until conflicting files are renamed
  await Promise.all(moveOps.map(moveFile))

  // as a last step, write the new index
  const index = files.map(({ timestamp }) => timestamp)
  fs.writeJSONSync(indexFileName, index)
  console.log(`wrote ${indexFileName} with ${index.length} entries`)
}

// sorts an array of items by its timestamp property
// and create a sequence number as a fraction for
// multiple items in the same second
// for performance reasons the array and timestamp are mutated in place
export const organizeByTimestamp = (items: MediaFile[]): void => {
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

const toSeconds = (timestamp: number) => Math.trunc(timestamp / 1000)

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
