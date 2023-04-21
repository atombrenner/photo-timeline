import { compressTimestamp, decompressTimestamp, deduplicateTimestamps } from './ordering'

const makeItems = (...timestamps: number[]) => timestamps.map((ts) => ({ ts }))

describe('deduplicateTimestamps', () => {
  it('should not modify if no duplicates present', () => {
    const timestamps = makeItems(1, 2, 3.1, 3.2, 4)
    deduplicateTimestamps(timestamps)

    expect(timestamps).toEqual(makeItems(1, 2, 3.1, 3.2, 4))
  })

  it('should add fractions to duplicates', () => {
    const timestamps = makeItems(1, 2, 3, 3, 4, 4)
    deduplicateTimestamps(timestamps)

    expect(timestamps).toEqual(makeItems(1, 2, 3.1, 3.2, 4.1, 4.2))
  })

  it('should add fractions to duplicates with the last item being unique', () => {
    const timestamps = makeItems(1, 1, 2, 3, 4, 4, 5)
    deduplicateTimestamps(timestamps)

    expect(timestamps).toEqual(makeItems(1.1, 1.2, 2, 3, 4.1, 4.2, 5))
  })

  it('should add one decimal place for 9 duplicates ', () => {
    const timestamps = makeItems(3, 3, 3, 3, 3, 3, 3, 3, 3)
    deduplicateTimestamps(timestamps)

    expect(timestamps).toEqual(makeItems(3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9))
  })

  it('should add two decimal place for 10 duplicates ', () => {
    const timestamps = makeItems(3, 3, 3, 3, 3, 3, 3, 3, 3, 3)
    deduplicateTimestamps(timestamps)

    expect(timestamps).toEqual(makeItems(3.01, 3.02, 3.03, 3.04, 3.05, 3.06, 3.07, 3.08, 3.09, 3.1))
  })
})

describe('timestamp compression', () => {
  it('should compress and decompress', () => {
    const compressed = compressTimestamp(Date.parse('2010-01-01'))
    expect(compressed).toEqual(5260320)
    const decompressed = decompressTimestamp(compressed)
    expect(decompressed).toEqual(Date.parse('2010-01-01'))
  })
})
