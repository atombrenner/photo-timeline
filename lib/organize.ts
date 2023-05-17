import { join } from 'node:path'
import { FromTo, moveFile, renameFile } from './filesystem'
import { MediaFile } from './media-file'
import { MakeMediaFilePath } from './names'
import { removeIndex, writeIndex } from './media-index'

export const organize = async (
  files: MediaFile[],
  rootPath: string,
  makeFilePath: MakeMediaFilePath,
) => {
  // sort files by timestamp and add sequence number as fraction (mutates files array)
  organizeByTimestamp(files)

  // calculate which files to move
  const makeAbsoluteFilePath = (timestamp: number) => join(rootPath, makeFilePath(timestamp))
  const { renameOps, moveOps } = calcMoveFileOps(files, makeAbsoluteFilePath)

  // Before we start moving files around, we *must* remove the index file.
  // Otherwise, if anything goes wrong during file movement, the index file
  // would be inconsistent with the file structure, and the next ingest
  // operation could potentially loose media files.
  await removeIndex(rootPath)

  // rename conflicting files before moving
  await Promise.all(renameOps.map(renameFile))

  // files must not be moved until all conflicting files are renamed
  await Promise.all(moveOps.map(moveFile))

  // write new index file
  await writeIndex(rootPath, files)
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

export const calcMoveFileOps = (files: MediaFile[], makeFilePath: MakeMediaFilePath) => {
  const targets = new Set<string>()
  const moveOps: FromTo[] = []

  for (const file of files) {
    if (file.path === file.timestamp) continue

    if (typeof file.path === 'number') {
      file.path = makeFilePath(file.path)
    }
    const path = makeFilePath(file.timestamp)
    if (file.path !== path) {
      moveOps.push({ from: file.path, to: path })
      targets.add(path)
    }
  }

  // temporary rename files which have a path that is the target of another file
  const renameOps: FromTo[] = []
  for (const move of moveOps) {
    if (targets.has(move.from)) {
      const tmpPath = move.from + '_'
      renameOps.push({ from: move.from, to: tmpPath })
      move.from = tmpPath
    }
  }

  return { renameOps, moveOps }
}
