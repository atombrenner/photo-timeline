import { readdir, statSync } from 'fs-extra'
import { join } from 'path'
import sharp from 'sharp'
import parseExif, { Exif } from 'exif-reader'

const path = '/home/christian/Photos/2003-06-29-003.jpg'
//const path = '/home/christian/Photos/20190806_140412.jpg'
//const path = '/home/christian/Photos/2019/01-Januar/2019-01-08 001.jpg'

// read dir
// readdir('/home/christian/Photos/2002', { withFileTypes: true })
//   .then((entries) => entries.map((e) => (e.isDirectory() ? `dir: ${e.name}` : 'other')))
//   .then(console.log)

// file stats
// const s = statSync('/home/christian/Photos/2019/01-Januar/2019-01-08 001.jpg')
// console.log(s)

// (jpg|jpeg)$

async function getImageCreationDate(file: string): Promise<number> {
  const throwIfUndefined = <T>(v?: T): T => {
    if (v == null) throw Error('Cannot get image creation date for ' + file)
    return v
  }
  const pickExif = (m: sharp.Metadata) => throwIfUndefined(m.exif)
  const pickCreationDate = (parsed: Exif) =>
    +throwIfUndefined(parsed.exif.DateTimeOriginal || parsed.image.ModifyDate)

  return sharp(file).metadata().then(pickExif).then(parseExif).then(pickCreationDate)
}

type MediaFile = {
  created: number // Date
  file: string
}

async function readFolder(folder: string, pattern = /\.(jpg|jpeg)$/): Promise<string[]> {
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

async function makeMediaFile(file: string): Promise<MediaFile> {
  return getImageCreationDate(file).then((created) => ({ created, file }))
}

readFolder('/home/christian/Photos/')
  .then((files) => Promise.all(files.map(makeMediaFile)))
  .then(console.log)

function importPhotos() {
  // const src = readFolder('DCIM')
  // group by month
  // foreach month do
  //    const month = readFolder(monthFolder)
  //    const merged =  merge srcMont, month   => {srcPath, dstPath}
  //    assert no duplicate dstPath
  //    merged.filter( srcPath !== dstPath) // ignore unchanged files
  //    updateMerged:
  //       foreach file
  //          if srcPath exist, move file with srcPath first // prevent overwrite, use recursion
}
