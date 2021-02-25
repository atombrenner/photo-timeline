import { statSync } from 'fs-extra'
import { readPhotoCreationDate, readFiles } from './read'
import { format, toDate } from 'date-fns'

const pattern = /\.jpe?g$/i

function exiv2(path: string, date: Date) {
  const exifDate = format(date, 'yyyy:MM:dd hh:mm:ss')
  const fraction = (+date % 1000).toString().padStart(3, '0')
  const subsec = fraction === '000' ? '' : `-M'set Exif.Photo.SubSecTimeOriginal ${fraction}'`
  return `exiv2 -k -M'set Exif.Photo.DateTimeOriginal ${exifDate}' ${subsec} '${path}'`
}

// repair photos with missing creation date
async function repairPhotos() {
  // //const files = await readFiles('/home/christian/Data/Daten/Bilder/Photos', pattern, '2001',)
  // const files = await readFiles('/home/christian/Photos', pattern)
  // for (const file of files) {
  //   try {
  //     await readPhotoCreationDate(file)
  //   } catch {
  //     const stats = statSync(file)
  //     console.log(exiv2(file, toDate(stats.mtimeMs)))
  //   }
  // }
}

repairPhotos().catch(console.error)
