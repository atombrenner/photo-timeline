import { join } from 'path'
import { move, mkdirp } from 'fs-extra'
import { readMediaFiles, calcMoveCommands, groupByFolder, organizeFolder } from './organize'

async function importPhotos() {
  const type = 'jpg'
  const rootFolder = `/home/christian/Photos`
  const newFiles = await readMediaFiles('/home/christian/DCIM')
  const folders = groupByFolder(newFiles)

  //const organizeFolder = async(folder: string, files: )

  await Promise.all(
    Object.entries(folders).map(async ([folder, files]) => {
      const folderPath = join(rootFolder, folder)
      // TODO: mkdirs(folderPath) if folder does not exist, create it
      const existingFiles = await readMediaFiles(folderPath)
      // TODO: validate that all existing files have the same folder
      const filesInFolder = organizeFolder(files, existingFiles, type)

      // TODO: (over)writeJson(join(folderPath, 'index.json'))
      for (const { from, to } of calcMoveCommands(filesInFolder, rootFolder)) {
        await move(from, to)
      }
    }),
  )

  return Object.keys(folders)
}

importPhotos().then(console.info).catch(console.error)
