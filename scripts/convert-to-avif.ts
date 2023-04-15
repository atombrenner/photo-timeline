import { statSync } from 'fs-extra'
import { join, basename } from 'path'
import sharp from 'sharp'
import { readPhotoCreationDate } from './read-creation-date'

const jpegs = [
  '/home/christian/Data/MyMedia/Photos/2016/08 August/2016-08-14 032.jpg',
  '/home/christian/Data/MyMedia/Photos/2016/08 August/2016-08-14 037.jpg',
  '/home/christian/Data/MyMedia/Photos/2016/08 August/2016-08-22 045.jpg',
]

async function main() {
  for (const jpeg of jpegs) {
    const avif = join('/tmp', basename(jpeg, '.jpg')) + '.avif'
    console.log(avif)

    const jpegSize = Math.round(statSync(jpeg).size / 1024)

    await sharp(jpeg).avif({ quality: 80 }).withMetadata().toFile(avif)

    const avifSize = Math.round(statSync(avif).size / 1024)

    console.log(new Date(await readPhotoCreationDate(avif)).toISOString())

    console.log(
      basename(jpeg),
      `jpeg: ${jpegSize}KiB, avif: ${avifSize}KiB, ${Math.round((avifSize / jpegSize) * 100)}%`,
    )
  }
}

main().catch(console.error)
