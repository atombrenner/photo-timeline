import { join } from 'path'
import { move, mkdirs } from 'fs-extra'
import {
  readMediaFiles,
  calcMoveCommands,
  groupByFolder,
  organizeFolder,
  assertAllFilesInSameFolder,
} from './organize'
import { readFolders, readOrganizedFolders } from './read'

const rootFolder = `/home/christian/Photos`
const type = 'jpg'

async function importPhotos() {
  const newFiles = await readMediaFiles('/home/christian/DCIM')
  const folders = groupByFolder(newFiles)

  //const organizeFolder = async(folder: string, files: )

  await Promise.all(
    Object.entries(folders).map(async ([folder, files]) => {
      const folderPath = join(rootFolder, folder)
      await mkdirs(folderPath) // if folder does not exist, create it
      const existingFiles = await readMediaFiles(folderPath)
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
  const folders = await readOrganizedFolders('/home/christian/Data/Daten/Bilder/Photos')
  for (const folder of folders) {
    console.log(folder)
    const files = await readMediaFiles(folder)
    // assertAllFilesInSameFolder(files)
  }
  return 'Done'
}

organizePhotos().then(console.info).catch(console.error)
