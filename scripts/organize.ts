import { makeFileName, MakeFolderName } from './names'
import { join, extname } from 'path'
import type { ReadCreationDate } from './read'

export interface MediaFile {
  path: string
  created: number // Date
  folder: string
}
export interface FinalMediaFile extends MediaFile {
  file: string
}

export async function readMediaFiles(
  files: string[],
  readCreationDate: ReadCreationDate,
  makeFolderName: MakeFolderName,
): Promise<MediaFile[]> {
  const makeMediaFile = async (path: string): Promise<MediaFile> => {
    const created = await readCreationDate(path)
    const folder = makeFolderName(created)
    return { path, created, folder }
  }

  return Promise.all(files.map(makeMediaFile))
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

export function assertAllFilesHaveSameFolder(files: { folder: string }[]) {
  if (!files.every((f) => f.folder === files[0].folder))
    throw Error('all files must have the same folder: ' + files.map((f) => f.folder).join(', '))
}

const compare = new Intl.Collator('en').compare

// merge two file arrays with the same folder, sort by creation date and generate filename
export function mergeFilesInFolder(left: MediaFile[], right: MediaFile[]): FinalMediaFile[] {
  const byCreated = (a: MediaFile, b: MediaFile) =>
    a.created === b.created ? compare(a.path, b.path) : a.created - b.created

  const makeFinalMediaFile = (item: MediaFile, index: number) => ({
    ...item,
    file: makeFileName(item.created, index, extname(item.path)),
  })

  const rightPath = new Set(right.map((f) => f.path))
  const uniqFiles = [...left.filter((f) => !rightPath.has(f.path)), ...right]

  return uniqFiles.sort(byCreated).map(makeFinalMediaFile)
}

// sort file for move operations
export function calcMoveCommands(files: FinalMediaFile[], rootFolder: string) {
  let filesToMove = files
    .map((f) => ({ from: f.path, to: join(rootFolder, f.folder, f.file) }))
    .filter((f) => f.from !== f.to)

  if (new Set(filesToMove.map((f) => f.to)).size !== filesToMove.length)
    throw Error('more than one file with the same target path detected')

  const commands = []

  // iterate in alternating order (to not degenerate performance)
  // over filesToMove until all commands are in an non overwriting order
  const blocked = new Set(filesToMove.map((f) => f.from))
  while (filesToMove.length > 0) {
    const blockedCommands = []
    for (let i = filesToMove.length; i-- > 0; ) {
      const command = filesToMove[i]
      if (blocked.has(command.to)) {
        blockedCommands.push(command)
      } else {
        commands.push(command)
        if (!blocked.has(command.from))
          throw Error('attemt to remove an unknown blocked file: ' + command.from)
        blocked.delete(command.from)
      }
    }
    // detect case when two files swap, eg 1 -> 2 and 2 -> 1
    if (filesToMove.length === blockedCommands.length) {
      const cmd = blockedCommands.pop()
      const parked = cmd!.to + '.parked'
      if (blocked.has(parked)) throw Error('cannot find a move command order')
      blocked.add(parked)
      blocked.delete(cmd!.from)
      commands.push({ from: cmd!.from, to: parked })
      blockedCommands.push({ from: parked, to: cmd!.to })
    }
    filesToMove = blockedCommands
  }

  return commands
}
