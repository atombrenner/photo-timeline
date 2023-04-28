import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

const localized = { locale: enUS }

export type MakeFolderName = (date: number) => string

export const makePhotoFolderName: MakeFolderName = (date) => format(date, 'yyyy/MM-MMMM', localized)
export const makeVideoFolderName: MakeFolderName = (date) => format(date, 'yyyy', localized)

export const makeFileName = (date: number, ext: string): string => {
  const seq = date.toFixed(2).split('.')[1]
  return format(date, 'yyyyMMdd-HHmmss') + (seq === '00' ? '' : '-' + seq) + ext.toLowerCase()
}
