import { fstat, statSync, readFileSync, removeSync } from 'fs-extra'
import { basename, dirname, join } from 'path'
import { readFiles } from './read'
import { readPhotoCreationDate, readVideoCreationDate } from './read-creation-date'
import { format, parseISO, addSeconds, addHours } from 'date-fns'

const pattern = /\.jpe?g$/i

const videoPattern = /\.(mp4|mov|avi|wmv)$/i

function exiv2(path: string, date: Date) {
  const exifDate = format(date, 'yyyy:MM:dd hh:mm:ss')
  const fraction = (+date % 1000).toString().padStart(3, '0')
  const subsec = fraction === '000' ? '' : `-M'set Exif.Photo.SubSecTimeOriginal ${fraction}'`
  return `exiv2 -k -M'set Exif.Photo.DateTimeOriginal ${exifDate}' ${subsec} '${path}'`
}

async function findVideosWithoutCreationDate() {
  const files = await readFiles('/home/christian/Data/MyMedia/Videos', videoPattern)
  for (const file of files) {
    try {
      const date = await readVideoCreationDate(file)
    } catch {
      // const stats = statSync(file)
      console.log(file)
    }
  }
}

// convert and add creationDate
async function convertVideoAndAddCreationDate() {
  const files = readFileSync('video-without-date.txt').toString().split('\n')
  const filesWithDate = files
    .filter((f) => f.length > 1)
    .map((file, i) => {
      const year = Number.parseInt(basename(dirname(file)))
      const name = basename(file)
      const match = name.match(/\d{4}-\d{2}-\d{2}/) // try to parse a date from filename
      const date = match ? parseISO(match[0] + 'T06:00:00Z') : new Date(year, 0, 1, 6, 0, 0)
      const dateWithOffset = addSeconds(date, i).toISOString()
      const mp4file = '/home/christian/converted/' + name.substr(0, name.length - 3) + 'mp4'
      return `ffmpeg -i "${file}" -metadata creation_time=${dateWithOffset} "${mp4file}"`
    })

  filesWithDate.forEach((f) => console.log(f))
}

async function findNonMp4Files() {
  const files = await readFiles('/home/christian/Data/MyMedia/Videos', videoPattern)
  files
    .filter((f) => !f.includes('unorganized') && !f.toLowerCase().endsWith('.mp4'))
    .forEach((f) => {
      console.log(f)
    })
}

async function convertNonMp4FilesWithMetadata() {
  const files = readFileSync('non-mp4-videos.txt').toString().split('\n')
  files
    .filter((f) => f.length > 1)
    .map((file) => {
      const name = basename(file)
      const mp4File = '/home/christian/converted2/' + name.substr(0, name.length - 3) + 'mp4'
      return `ffmpeg -i "${file}" -map_metadata 0 "${mp4File}"`
    })
    .forEach((f) => console.log(f))
}

// repair photos with missing creation date
async function repair() {}

repair().catch(console.error)
