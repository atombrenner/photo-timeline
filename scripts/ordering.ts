type Timestamp = number

type MediaFile2 = {
  path: string
  index: number // derived from original timestamp with lowered precision and fractions for stable ordering
  original: number // timestamp from file
}

export type Timestamped = {
  ts: number
}

const toSeconds = (ts: number) => Math.trunc(ts / 1000)

// deduplicates a sorted list of timestamps by adding a
// sequence number as a fraction
// 1. remove existing fractions
// 2. sort
// 3. deduplicate for a second precision, by adding a sequence number as a fraction
// for performance reasons the elements of the array are modified
export const deduplicateTimestamps = (items: Timestamped[]) => {
  for (let i = items.length; i-- > 0; ) items[i].ts = Math.trunc(items[i].ts)
  items.sort((a, b) => a.ts - b.ts)

  for (let i = items.length - 1; i > 0; ) {
    const stop = i
    const value = toSeconds(items[stop].ts)
    //console.log(value, i, items[i])
    do i--
    while (i >= 0 && toSeconds(items[i].ts) === value)
    const count = stop - i
    if (count > 1) {
      if (count > 99) throw Error('too many duplicates')
      // add sequence number j as a two digit fraction
      for (let j = 1; j <= count; ++j) {
        items[i + j].ts += j / 100
      }
    }
  }
}
