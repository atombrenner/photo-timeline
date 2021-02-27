import { fstat, statSync, readFileSync } from 'fs-extra'
import { basename, dirname, join } from 'path'
import { readPhotoCreationDate, readFiles, readVideoCreationDate } from './read'
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

// repair photos with missing creation date
async function repair() {
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

repair().catch(console.error)
