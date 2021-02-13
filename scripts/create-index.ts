import { readdir, writeJson } from 'fs-extra'
import { join } from 'path'
import { mediaPattern } from './ingest'
import { readFiles } from './read'

function readNumberedFolders(folder: string) {
  return readdir(folder, { withFileTypes: true }).then((entries) =>
    entries.filter((e) => e.isDirectory() && /\d+/.test(e.name)).map((e) => join(folder, e.name)),
  )
}

async function writeIndexFile(folder: string, entries: string[]) {
  const length = folder.length + (folder.endsWith('/') ? 0 : 1)
  const sorted = entries.map((e) => e.substr(length)).sort()
  await writeJson(join(folder, 'index.json'), sorted)
  return sorted
}

async function createRootIndexFile(root: string) {
  const years = await readNumberedFolders(root)
  const folders = await Promise.all(years.map((year) => readNumberedFolders(year)))
  return await writeIndexFile(root, folders.flat())
}

async function createFolderIndexFile(folder: string) {
  const files = await readFiles(folder, mediaPattern)
  return await writeIndexFile(folder, files)
}

async function createAllIndexFiles(root: string) {
  const folders = await createRootIndexFile(root)
  await Promise.all(folders.map((f) => createFolderIndexFile(join(root, f))))
}

createAllIndexFiles('/home/christian/Photos').catch(console.error)
