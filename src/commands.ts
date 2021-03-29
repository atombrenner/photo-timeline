import add from 'date-fns/add'

export type NavigationCommand = (images: string[], current: number) => number

const stepN = (count: number) => (images: string[], current: number) => {
  current += count
  if (current < 0) return 0
  if (current >= images.length) return images.length - 1
  return current
}

export const next = stepN(1)
export const next10 = stepN(10)
export const next20 = stepN(20)
export const next30 = stepN(30)
export const next50 = stepN(50)
export const prev = stepN(-1)
export const prev10 = stepN(-10)
export const prev20 = stepN(-20)
export const prev30 = stepN(-30)
export const prev50 = stepN(-50)

function getDate(imagePath: string) {
  return imagePath.substr(imagePath.lastIndexOf('/') + 1, 10)
}

function addToDate(imagePath: string, duration: Duration) {
  return add(Date.parse(getDate(imagePath)), duration)
    .toISOString()
    .substr(0, 10)
}

const nextDate = (offset: Duration) => (images: string[], current: number) => {
  const stopDate = addToDate(images[current], offset)
  for (let i = current + 1; i < images.length; i += 1) {
    if (getDate(images[i]) >= stopDate) return i
  }
  return images.length - 1
}

const prevDate = (offset: Duration) => (images: string[], current: number) => {
  const stopDate = addToDate(images[current], offset)
  for (let i = current - 1; i >= 0; i -= 1) {
    if (getDate(images[i]) <= stopDate) return i
  }
  return 0
}

export const nextDay = nextDate({ days: 1 })
export const nextWeek = nextDate({ weeks: 1 })
export const nextMonth = nextDate({ months: 1 })
export const nextYear = nextDate({ years: 1 })
export const prevDay = prevDate({ days: -1 })
export const prevWeek = prevDate({ weeks: -1 })
export const prevMonth = prevDate({ months: -1 })
export const prevYear = prevDate({ years: -1 })
