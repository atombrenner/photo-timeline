import { format } from 'date-fns'
import { de } from 'date-fns/locale'

const localized = { locale: de }

export function makeFolderName(created: number) {
  return format(created, 'yyyy/MM_MMMM', localized)
}

export function makeFileName(created: number, index: number, type: string) {
  const number = (index + 1).toString().padStart(3, '0')
  return format(created, 'yyyy-MM-dd', localized) + `_${number}.${type}`
}
