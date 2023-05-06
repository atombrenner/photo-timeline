import add from 'date-fns/add'

export type NavigationCommand = (photos: number[], current: number) => number

const skipN = (count: number) => (photos: number[], current: number) => {
  console.log('skip', count, current, photos.length)
  current += count
  if (current < 0) return 0
  if (current >= photos.length) return photos.length - 1
  return current
}

export const next = skipN(1)
export const next10 = skipN(10)
export const next20 = skipN(20)
export const next30 = skipN(30)
export const next50 = skipN(50)
export const prev = skipN(-1)
export const prev10 = skipN(-10)
export const prev20 = skipN(-20)
export const prev30 = skipN(-30)
export const prev50 = skipN(-50)

const nextDate = (offset: Duration) => (photos: number[], current: number) => {
  const stopDate = Number(add(photos[current], offset))
  for (let i = current + 1; i < photos.length; i += 1) {
    if (photos[i] >= stopDate) return i
  }
  return photos.length - 1
}

const prevDate = (offset: Duration) => (photos: number[], current: number) => {
  const stopDate = Number(add(photos[current], offset))
  for (let i = current - 1; i >= 0; i -= 1) {
    if (photos[i] <= stopDate) return i
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

export const first = () => 0
export const last = (photos: number[]) => photos.length - 1
export const start = (photos: number[]) => {
  // todo start with first photo of last ingestion (need some persistent state)
  return last(photos)
}
