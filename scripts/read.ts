import { Dirent, readdir } from 'fs-extra'
import { join } from 'path'
import sharp from 'sharp'
import parseExif, { Exif } from 'exif-reader'

// read all file names from a folder and all subfolders recusively
export async function readFiles(folder: string, pattern: RegExp): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true })
  const folders: string[] = []
  const files: string[] = []
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!/^[_.]|00-no-date/.test(entry.name)) folders.push(join(folder, entry.name))
    } else if (pattern.test(entry.name)) {
      files.push(join(folder, entry.name))
    }
  }
  const moreFiles = await Promise.all(folders.map((f) => readFiles(f, pattern)))
  return [...files, ...moreFiles.flat()]
}

export async function readOrganizedFolders(folder: string): Promise<string[]> {
  const isFolder = (pattern: RegExp) => (e: Dirent) => e.isDirectory() && pattern.test(e.name)
  const entries = await readdir(folder, { withFileTypes: true })
  const years = entries.filter(isFolder(/^\d{4}/)).map((e) => join(folder, e.name))
  const foldersOfYears = await Promise.all(
    years.map(async (folder) => {
      const entries = await readdir(folder, { withFileTypes: true })
      return entries.filter(isFolder(/^\d{2} .*/)).map((e) => join(folder, e.name))
    }),
  )
  return foldersOfYears.flat()
}

export async function getImageCreationDate(path: string): Promise<number> {
  const throwIfUndefined = <T>(v?: T): T => {
    if (v == null) throw Error('Cannot get image creation date for ' + path)
    return v
  }
  const pickExif = (m: sharp.Metadata) => throwIfUndefined(m.exif)
  const pickCreationDate = (parsed: Exif) =>
    +throwIfUndefined(parsed.exif?.DateTimeOriginal || parsed.image.ModifyDate)

  return sharp(path).metadata().then(pickExif).then(parseExif).then(pickCreationDate)
}

export async function getVideoCreationDate(path: string): Promise<number> {
  throw Error('Not implemented')
}
