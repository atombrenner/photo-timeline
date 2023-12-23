import { format } from 'date-fns/format'
import { enUS } from 'date-fns/locale'
import { join } from 'node:path'

const localized = { locale: enUS }

export type MakeMediaFilePath = (timestamp: number) => string

export const makePhotoFilePath = (timestamp: number) =>
  join(makePhotoFolderName(timestamp), makeFileName(timestamp, '.jpg'))

export const makeVideoFilePath = (timestamp: number) =>
  join(makeVideoFolderName(timestamp), makeFileName(timestamp, '.mp4'))

export const makePhotoFolderName = (timestamp: number) =>
  format(timestamp, 'yyyy/MM-MMMM', localized)

export const makeVideoFolderName = (timestamp: number) => format(timestamp, 'yyyy')

export const makeFileName = (timestamp: number, ext: string): string => {
  const seq = timestamp.toFixed(2).split('.')[1]
  return format(timestamp, 'yyyyMMdd-HHmmss') + (seq === '00' ? '' : '-' + seq) + ext
}
