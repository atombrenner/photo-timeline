import { deduplicateTimestamps } from './ordering'

const makeItems = (...timestamps: number[]) => timestamps.map((ts, id) => ({ ts, id }))

describe('deduplicateTimestamps // organizeIndex?', () => {
  it('should not modify if no duplicates present', () => {
    const items = makeItems(1000, 2000, 3000, 4000)
    deduplicateTimestamps(items)
    expect(items).toEqual(makeItems(1000, 2000, 3000, 4000))
  })

  it('should add sequence number as fraction to duplicates', () => {
    const items = makeItems(1000, 2000, 3100.5, 3200.8, 3500.01, 4000, 4999, 5000)
    deduplicateTimestamps(items)
    expect(items).toEqual(makeItems(1000, 2000, 3100.01, 3200.02, 3500.03, 4000.01, 4999.02, 5000))
  })

  it('should add fractions to duplicates with the last and first item being unique', () => {
    const items = makeItems(1000, 1000, 2000, 3000, 4000, 5000, 5000)
    deduplicateTimestamps(items)
    expect(items).toEqual(makeItems(1000.01, 1000.02, 2000, 3000, 4000, 5000.01, 5000.02))
  })

  it('should sort by timestamp', () => {
    const items = makeItems(5000, 4000, 3000, 2000, 1000)
    deduplicateTimestamps(items)
    expect(items).toEqual([
      { ts: 1000, id: 4 },
      { ts: 2000, id: 3 },
      { ts: 3000, id: 2 },
      { ts: 4000, id: 1 },
      { ts: 5000, id: 0 },
    ])
  })

  it('should stable sort items by timestamp', () => {
    const items = makeItems(1000, 2000, 3000, 2000, 2000)
    deduplicateTimestamps(items)
    expect(items).toEqual([
      { ts: 1000, id: 0 },
      { ts: 2000.01, id: 1 },
      { ts: 2000.02, id: 3 },
      { ts: 2000.03, id: 4 },
      { ts: 3000, id: 2 },
    ])
  })
})
