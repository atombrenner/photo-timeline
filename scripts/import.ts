import { join } from 'path'
import { move, mkdirs, fstatSync, statSync } from 'fs-extra'
import {
  readMediaFiles,
  calcMoveCommands,
  groupByFolder,
  organizeFolder,
  assertAllFilesInSameFolder,
} from './organize'
import { getImageCreationDate, readFiles } from './read'
import { format, toDate } from 'date-fns'

const rootFolder = `/home/christian/Photos`
const type = 'jpg'
const pattern = /\.jpe?g$/i

async function importPhotos() {
  const newFiles = await readMediaFiles('/home/christian/DCIM', pattern)
  const folders = groupByFolder(newFiles)

  //const organizeFolder = async(folder: string, files: )

  await Promise.all(
    Object.entries(folders).map(async ([folder, files]) => {
      const folderPath = join(rootFolder, folder)
      await mkdirs(folderPath) // if folder does not exist, create it
      const existingFiles = await readMediaFiles(folderPath, pattern)
      const organizedFiles = organizeFolder(files, existingFiles, type)
      assertAllFilesInSameFolder(organizedFiles)
      // TODO: (over)writeJson(join(folderPath, 'index.json'))
      for (const { from, to } of calcMoveCommands(organizedFiles, rootFolder)) {
        //await move(from, to)
      }
    }),
  )

  return Object.keys(folders)
}

async function organizePhotos() {
  const created = await getImageCreationDate('/home/christian/Photos/00-no-date/test.jpg')
  console.log(toDate(created).toISOString())

  //const files = await readFiles('/home/christian/Data/Daten/Bilder/Photos', pattern)
  // const files = await readFiles('/home/christian/Photos', pattern)
  // for (const file of files) {
  //   const created = await getImageCreationDate(file)
  //   if (!created) {
  //     console.log(file)
  //     const stats = statSync(file)
  //     console.log(toDate(stats.mtimeMs).toISOString())
  //   }
  // }

  // for (const folder of folders) {
  //   console.log(folder)
  //   const files = await readMediaFiles(folder, pattern)
  //   // assertAllFilesInSameFolder(files)
  // }
  return 'Done'
}

organizePhotos().then(console.info).catch(console.error)
