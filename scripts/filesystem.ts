import { join } from 'node:path'
import { readdir } from 'node:fs/promises'
import fs from 'fs-extra'

export type FromTo = { from: string; to: string }

export const moveFile = ({ from, to }: FromTo): Promise<void> => {
  console.log(`move ${from} -> ${to}`)
  return fs.move(from, to, { overwrite: false })
}

export const renameFile = ({ from, to }: FromTo): Promise<void> => {
  console.log(`rename ${from} -> ${to}`)
  return fs.rename(from, to)
}

// ignore folders that start with a dot or are surrounded with underscores
const ignoredFolders = /^((\..*)|(_.*_))$/

/** list all folders without matching files */
// export async function listFoldersWithoutFiles(folder: string, pattern: RegExp) {
//   const folders = await listFolders(folder)
//   await Promise.all(folders.map((f) => removeFoldersWithoutFiles(f, pattern)))
//   await listFiles(folder, pattern)

//   if (photos.length + videos.length === 0) {
//     await removeEmptyFolder(folder)
//   }
// }

// list recursively all files in a folder that match the given pattern
// the returned list is sorted and each item is the full path
export async function listFiles(folder: string, pattern: RegExp): Promise<string[]> {
  const paths: string[] = []

  const innerReadFiles = async (folder: string) => {
    const entries = await readdir(folder, { withFileTypes: true })
    const folders: string[] = []
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoredFolders.test(entry.name)) continue
        folders.push(join(folder, entry.name))
      } else if (pattern.test(entry.name)) {
        paths.push(join(folder, entry.name))
      }
    }
    await Promise.all(folders.map((f) => innerReadFiles(f)))
  }

  await innerReadFiles(folder)
  return paths.sort()
}

// list non-recursively (flat) all folders
// the returned list is sorted and each entry is the full path
export async function listFolders(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && e.name[0] !== '.')
    .map((e) => join(folder, e.name))
    .sort()
}
