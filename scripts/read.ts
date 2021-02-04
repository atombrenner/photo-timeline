import { readdir } from 'fs-extra'
import { join } from 'path'
import sharp from 'sharp'
import parseExif, { Exif } from 'exif-reader'
import { makeFileName, makeFolderName } from './names'

export type MediaFile = {
  path: string
  created: number // Date
  folder: string
  file: string
}

export async function readFolder(folder: string, pattern = /\.(jpg|jpeg)$/i): Promise<string[]> {
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
  const moreFiles = await Promise.all(folders.map((f) => readFolder(f, pattern)))
  return [...files, ...moreFiles.flat()]
}

export async function getImageCreationDate(path: string): Promise<number> {
  const throwIfUndefined = <T>(v?: T): T => {
    if (v == null) throw Error('Cannot get image creation date for ' + path)
    return v
  }
  const pickExif = (m: sharp.Metadata) => throwIfUndefined(m.exif)
  const pickCreationDate = (parsed: Exif) =>
    +throwIfUndefined(parsed.exif.DateTimeOriginal || parsed.image.ModifyDate)

  return sharp(path).metadata().then(pickExif).then(parseExif).then(pickCreationDate)
}
