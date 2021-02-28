import { format } from 'date-fns'
import { de } from 'date-fns/locale'

const localized = { locale: de }

export type MakeFolderName = (created: number) => string

export function makePhotoFolderName(created: number) {
  return format(created, 'yyyy/MM MMMM', localized)
}

export function makeVideoFolderName(created: number) {
  return format(created, 'yyyy', localized)
}

// no time information will be encoded in filename
export function makeFileName(created: number, index: number, type: string) {
  const number = (index + 1).toString().padStart(3, '0')
  return format(created, 'yyyy-MM-dd', localized) + ` ${number}` + type.toLowerCase()
}
