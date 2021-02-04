import { makeFileName, makeFolderName } from './names'
import { join } from 'path'
import { DesiredMediaFile, MediaFile } from './media-file'
import { appendFileSync } from 'fs-extra'
import { getImageCreationDate, readFolder } from './read'

export interface ReadCreatedFn {
  (path: string): Promise<number>
}

// TODO: getVideoCreationDate

async function makeMediaFile(path: string) {
  const created = await getImageCreationDate(path)
  const folder = makeFolderName(created)
  return { path, created, folder }
}

export async function readMediaFiles(folder: string) {
  return readFolder(folder).then((files) => Promise.all(files.map(makeMediaFile)))
}

export async function groupByFolder<T extends { folder: string }>(files: T[]) {
  const grouped: Record<string, T[]> = {}
  for (const file of files) {
    const group = grouped[file.folder] ?? []
    if (group.length === 0) grouped[file.folder] = group
    group.push(file)
  }
  return grouped
}

export function organizeFolder<T extends { created: number }>(left: T[], right: T[], type: string) {
  const byCreationDate = (a: T, b: T) => a.created - b.created
  const toMediaFile = (item: T, index: number) => ({
    ...item,
    file: makeFileName(item.created, index, type),
  })
  return [...left, ...right].sort(byCreationDate).map(toMediaFile)
}

// sort file for move operations
export function calcMoveCommands(files: MediaFile[], rootFolder: string) {
  const filesToMove = files
    .map((f) => ({ from: f.path, to: join(rootFolder, f.folder, f.file) }))
    .filter((f) => f.from !== f.to)

  const unmoved = new Set(filesToMove)

  //   const moveOrder = []
  //   // alternating go forward and backward through the files
  //   // and push files that will not overwrite to the moveOrder
  //   files.forEach((file) => {
  //     if (!filesContainPath(file.desiredPath)) {
  //       moveOrder.push(file)
  //       files.remove(file)
  //     }
  //   })
  // }

  return filesToMove
}
