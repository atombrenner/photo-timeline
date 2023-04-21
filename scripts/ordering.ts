type Timestamp = number // compressed timestamp

const precision = 60_000 // minute
const offset = Date.parse('2000')

export const compressTimestamp = (date: Date | number) => Math.floor((+date - offset) / precision)
export const decompressTimestamp = (ts: Timestamp) => ts * precision + offset

export const makeFileName = (ts: Timestamp): string => {
  const date = new Date(ts * 3600_000)
  const seq = ts.toString(10).split('.')[1] ?? ''
  return date.toISOString().substring(0, 12).replace('T', '-') + seq
}

type MediaFile2 = {
  path: string
  index: number // derived from original timestamp with lowered precision and fractions for stable ordering
  original: number // timestamp from file
}

export type Timestamped = {
  ts: number
}

// preconditions
// - sorted by timestamps
// - timestamps are integers (fractions removed)
// for performance reasons the elements of the array are modified
export const deduplicateTimestamps = (items: Timestamped[]) => {
  for (let i = 0; i < items.length - 1; ) {
    const start = i
    do ++i
    while (i < items.length && items[i].ts === items[start].ts)
    const count = i - start
    if (count > 1) {
      const divisor = getDivisor(count)
      for (let j = 0; j < count; ) {
        items[start + j].ts += ++j / divisor
      }
    }
  }
}

const getDivisor = (count: number) => {
  // return 10 ** Math.ceil(Math.log(count))
  if (count < 10) return 10
  if (count < 100) return 100
  if (count < 1000) return 1000
  throw Error('too many duplicates')
}
