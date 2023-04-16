import { join } from 'node:path'
import { readdir } from 'node:fs/promises'

// ignore folders that start with a dot or are surrounded with underscores
const ignoredFolders = /^((\..*)|(_.*_))$/

// recursively read all file names that match a pattern from a folder
export async function readFiles(folder: string, pattern: RegExp): Promise<string[]> {
  const files: string[] = []

  const innerReadFiles = async (folder: string) => {
    const entries = await readdir(folder, { withFileTypes: true })
    const folders: string[] = []
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoredFolders.test(entry.name)) continue
        folders.push(join(folder, entry.name))
      } else if (pattern.test(entry.name)) {
        files.push(join(folder, entry.name))
      }
    }
    await Promise.all(folders.map((f) => innerReadFiles(f)))
  }

  await innerReadFiles(folder)
  return files.sort()
}

// read all folders in folder */
export async function readFolders(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && e.name[0] !== '.')
    .map((e) => join(folder, e.name))
    .sort()
}
