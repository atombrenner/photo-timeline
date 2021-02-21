import { pathExists, readdir, writeJson } from 'fs-extra'
import { join } from 'path'
import { mediaPattern } from './ingest'
import { readFiles } from './read'

// reads organized media folders and creates a json like this:
// {
//   "2010/01 Januar": ["02 001.jpg", "02 002.jpg"],
//   "2010/02 Februar": ["17 001.jpg"]
// }

// TODO: optimize index format by removing even more redundant stuff, possible only if only one extension exists
// {
//   "2010/01 Januar": [2, 2, 5], => could be expanded to ["2010-01-02-001.jpg", "2010-01-02-002.jpg", "2010-01-05-003.jpg"]
// }

async function readNumberedFolders(folder: string) {
  const entries = await readdir(folder, { withFileTypes: true })
  const folders = entries.filter((e) => e.isDirectory() && /\d+/.test(e.name))
  return folders.map((f) => join(folder, f.name))
}

async function createIndex(root: string) {
  const years = await readNumberedFolders(root)
  const months = await Promise.all(years.map((year) => readNumberedFolders(year)))
  const folders = months.flat().sort()

  let count = 0
  const entries = await Promise.all(
    folders.map(async (folder) => {
      const pathLength = folder.length + 1 + 'yyyy-MM-'.length // strip redundant path info
      const toFilename = (path: string) => path.substr(pathLength)
      const files = await readFiles(folder, mediaPattern)
      count += files.length
      return [folder.substr(root.length + 1), files.sort().map(toFilename)]
    }),
  )

  await writeJson(join(root, 'index.json'), Object.fromEntries(entries))
  console.log(`indexed ${count} files`)
}

createIndex('/home/christian/Photos').catch(console.error)
