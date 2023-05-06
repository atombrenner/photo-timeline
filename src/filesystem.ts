import { join, basename } from 'node:path'
import { readdir, rmdir } from 'node:fs/promises'
import { move, rename } from 'fs-extra'

export type FromTo = { from: string; to: string }

export const moveFile = ({ from, to }: FromTo): Promise<void> => {
  console.log(`move ${from} -> ${to}`)
  return move(from, to, { overwrite: false })
}

export const renameFile = ({ from, to }: FromTo): Promise<void> => {
  console.log(`rename ${from} -> ${to}`)
  return rename(from, to)
}

// ignore folders that start with a dot or are surrounded with underscores
const ignoredFolders = /^((\..*)|(_.*_))$/

// list recursively all files in a folder that match the given pattern
// the returned list is sorted and each item is the full path
export const listFiles = async (folder: string, pattern: RegExp): Promise<string[]> => {
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

export const removeEmptyFolders = async (folder: string): Promise<boolean> => {
  if (ignoredFolders.test(basename(folder))) return false
  const folders = []
  let hasFiles = false
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (entry.isDirectory()) folders.push(entry.name)
    else hasFiles = true
  }
  const removed = await Promise.all(folders.map((f) => removeEmptyFolders(join(folder, f))))
  if (hasFiles || removed.some((f) => !f)) return false

  console.log(`removing empty folder ${folder}`)
  await rmdir(folder)
  return true
}
