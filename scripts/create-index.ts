import { pathExists, readdir, writeJson } from 'fs-extra'
import { join } from 'path'
import { PhotoPattern, PhotoRoot, VideoPattern, VideoRoot } from './config'
import { readFiles } from './read'

// compact json representation of a list of string who share a common prefix
// decoding is easy, encoding
const compactIndes = {
  jpg: [
    { '2009/01 Januar/2009-01-': ['01 001', '02 002'] },
    { '2009/02 Februar/2009-02-01 0': ['01', '02', '03', '05'] },
  ],
}

// reads organized media folders and creates a json like this:
// {
//   "2010/01 Januar": ["02 001.jpg", "02 002.jpg"],
//   "2010/02 Februar": ["17 001.jpg"]
// }

// TODO: optimize index format by removing even more redundant stuff, possible only if only one extension exists
// {
//   "2010-01": [2, 2, 5], => could be expanded to [[2010,1,2]] => "/2010/01 Januar/2010-01-02 001.jpg" ["/2010/01 Januar/2010-01-02 001.jpg", "2010-01-02-002.jpg", "2010-01-05-003.jpg"]
// }

async function readNumberedFolders(folder: string) {
  const entries = await readdir(folder, { withFileTypes: true })
  const folders = entries.filter((e) => e.isDirectory() && /\d+/.test(e.name))
  return folders.map((f) => join(folder, f.name))
}

export async function createIndex(root: string, pattern: RegExp) {
  const rawFiles = await readFiles(root, pattern)

  const redundantPrefix = root.length + 1
  const files = rawFiles
    .map((f) => f.substr(redundantPrefix))
    .filter((f) => /^\d{4}/.test(f))
    .sort()

  await writeJson(join(root, 'index.json'), files)
  console.log(`indexed ${files.length} files`)
}

export async function createPhotoAndVideoIndex() {
  await createIndex(PhotoRoot, PhotoPattern)
  await createIndex(VideoRoot, VideoPattern)
}

if (require.main === module) {
  createPhotoAndVideoIndex().catch(console.error)
}
