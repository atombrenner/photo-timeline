import { makeFileName, makeFolderName } from './names'
import { join } from 'path'
import { MediaFile } from './media-file'
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

// merge to file arrays, sort by creation date and generate filename
export function organizeFolder<T extends { created: number }>(left: T[], right: T[], type: string) {
  const byCreationDate = (a: T, b: T) => a.created - b.created
  const addFileName = (item: T, index: number) => ({
    ...item,
    file: makeFileName(item.created, index, type),
  })

  return [...left, ...right].sort(byCreationDate).map(addFileName)
}

// sort file for move operations
export function calcMoveCommands(files: MediaFile[], rootFolder: string) {
  if (!files.every((f) => f.folder === files[0].folder))
    throw Error('all files must have the same folder')

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
        if (!blocked.has(command.from)) throw Error('attemt to remove an unknown blocked file')
        blocked.delete(command.from)
      }
    }
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
