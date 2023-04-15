import { join } from 'node:path'
import { readdir } from 'node:fs/promises'

import parseExif, { Exif } from 'exif-reader'
import sharp from 'sharp'
import { ffprobe } from './ffprobe'

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
  return files
}

// read all folders in folder */
export async function readFolders(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && e.name[0] !== '.')
    .map((e) => join(folder, e.name))
}

export type ReadCreationDate = (path: string) => Promise<number>

export const readPhotoCreationDate: ReadCreationDate = async (path) => {
  const throwIfUndefined = <T>(v: T | undefined | null): T => {
    if (!v) throw Error('Cannot get image creation date for ' + path)
    return v
  }
  const pickExif = (m: sharp.Metadata) => throwIfUndefined(m.exif)
  const pickCreationDate = (parsed: Exif) => {
    const ms = Number('0.' + (parsed.exif?.SubSecTimeOriginal || '0')) * 1000
    const created = +(parsed.exif?.DateTimeOriginal || parsed.image?.ModifyDate || 0) + ms
    if (created < 1) throw Error('Cannot get image creation date for ' + path)
    return created
  }

  return sharp(path).metadata().then(pickExif).then(parseExif).then(pickCreationDate)
}

export const readVideoCreationDate: ReadCreationDate = async (path) => {
  // ideally get it from mp4 container
  const { created } = await ffprobe(path) // works for avi, mp4, mov
  if (!isNaN(created)) return created
  throw Error('Cannot get video creation date for ' + path)
}
