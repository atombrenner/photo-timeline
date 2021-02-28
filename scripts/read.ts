import { existsSync, readdir, stat } from 'fs-extra'
import { join } from 'path'
import sharp from 'sharp'
import parseExif, { Exif } from 'exif-reader'
import { ffprobe } from './ffprobe'

// read all file names from a folder and all subfolders recusively
export async function readFiles(folder: string, pattern: RegExp): Promise<string[]> {
  if (!existsSync(folder)) return [] // only necessary because in dry run folders are not created
  const entries = await readdir(folder, { withFileTypes: true })
  const folders: string[] = []
  const files: string[] = []
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name[0] !== '.') folders.push(join(folder, entry.name))
    } else if (pattern.test(entry.name)) {
      files.push(join(folder, entry.name))
    }
  }
  const moreFiles = await Promise.all(folders.map((f) => readFiles(f, pattern)))
  return [...files, ...moreFiles.flat()]
}

export async function readFolders(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && e.name[0] !== '.')
    .map((e) => join(folder, e.name))
}

export async function readStats(path: string) {
  const stats = await stat(path)
  return { size: stats.size, modified: stats.mtimeMs }
}

export type ReadCreationDate = (path: string) => Promise<number>

export async function readPhotoCreationDate(path: string): Promise<number> {
  const throwIfUndefined = <T>(v: T | undefined | null): T => {
    if (!v) throw Error('Cannot get image creation date for ' + path)
    return v
  }
  const pickExif = (m: sharp.Metadata) => throwIfUndefined(m.exif)
  const pickCreationDate = (parsed: Exif) => {
    const ms = Number('0.' + (parsed.exif?.SubSecTimeOriginal || '0')) * 1000
    const created = +(parsed.exif?.DateTimeOriginal || 0) + ms
    if (created < 1) throw Error('Cannot get image creation date for ' + path)
    return created
  }

  return sharp(path).metadata().then(pickExif).then(parseExif).then(pickCreationDate)
}

export async function readVideoCreationDate(path: string): Promise<number> {
  // ideally get it from mp4 container
  const { created } = await ffprobe(path) // works for avi, mp4, mov
  if (!isNaN(created)) return created
  throw Error('Cannot get video creation date for ' + path)
}
