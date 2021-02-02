import { readFolder, getImageCreationDate } from './read'
import { makeFileName, makeFolderName } from './names'
import { join } from 'path'
import { mv } from 'fs-extra'

type MediaFile = {
  created: number // Date
  path: string
}

type DesiredFile = MediaFile & {
  desiredPath: string
}

//
function merge(
  newFiles: MediaFile[],
  existingFiles: MediaFile[],
  folder: string,
  type: string,
): DesiredFile[] {
  const byCreationDate = (a: MediaFile, b: MediaFile) => a.created - b.created
  const makeDesiredFile = (f: MediaFile, i: number) => ({
    ...f,
    desiredPath: join(folder, makeFileName(f.created, i, type)),
  })
  return [...existingFiles, ...newFiles].sort(byCreationDate).map(makeDesiredFile)
}

//   const moveOrder = []
//   // alternating go forward and backward through the files
//   // and push files that will not overwrite to the moveOrder
//   files.forEach((file) => {
//     if (!filesContainPath(file.desiredPath)) {
//       moveOrder.push(file)
//       files.remove(file)
//     }
//   })
// }

async function readMediaFiles(folder: string): Promise<MediaFile[]> {
  const makeMediaFile = (path: string) =>
    getImageCreationDate(path).then((created) => ({ created, path }))
  return readFolder(folder).then((files) => Promise.all(files.map(makeMediaFile)))
}

function groupByFolder(files: MediaFile[]): Record<string, MediaFile[]> {
  const grouped: Record<string, MediaFile[]> = {}
  for (const file of files) {
    const folder = makeFolderName(file.created)
    const group = grouped[folder] ?? []
    if (group.length === 0) grouped[folder] = group
    group.push(file)
  }
  return grouped
}

function orderMoveCommands(files: DesiredFile[]) {
  return files
}

async function importPhotos() {
  const type = 'jpg'
  const photoPath = `/home/christian/Photos`
  const newFiles = await readMediaFiles('/home/christian/DCIM')
  const folders = groupByFolder(newFiles)
  for (const [folder, files] of Object.entries(folders)) {
    const folderPath = join(photoPath, folder)
    const existingFiles = await readMediaFiles(folderPath)
    const desiredFiles = merge(files, existingFiles, folderPath, type)
    // TODO: create index.json
    for (const file of orderMoveCommands(desiredFiles)) {
      //  mv(file.path -> file.desiredPath)
    }
  }

  return Object.keys(folders)
}

importPhotos().then(console.info).catch(console.error)
