import { readJSON, move, writeJSON, existsSync } from 'fs-extra'
import { join } from 'node:path'
import { MediaFile } from './media-file'

export const readIndex = async (rootPath: string): Promise<MediaFile[]> => {
  const indexPath = getIndexFilePath(rootPath)

  if (!existsSync(indexPath))
    throw Error(`index ${indexPath} not found, use 'npx reindex' to create/repair it`)

  const index = await readJSON(getIndexFilePath(rootPath))
  for (let i = index.length; i-- > 0; ) {
    const timestamp = index[i]
    index[i] = { path: timestamp, timestamp }
  }
  return index
}

export const writeIndex = async (rootPath: string, files: MediaFile[]) => {
  const index = files.map(({ timestamp }) => timestamp)
  const indexPath = getIndexFilePath(rootPath)
  await writeJSON(indexPath, index)
  console.log(`wrote index with ${index.length} entries to ${indexPath}`)
}

export const removeIndex = async (rootPath: string) => {
  const indexPath = getIndexFilePath(rootPath)
  await move(indexPath, indexPath + '.bak', { overwrite: true })
}

const getIndexFilePath = (rootPath: string) => join(rootPath, 'index.json')
