import { calcMoveFileOps, organizeByTimestamp } from './organize'

const makeItems = (...timestamps: number[]) =>
  timestamps.map((timestamp, i) => ({ timestamp, path: i.toString() }))

describe('organizeByTimestamp', () => {
  it('should not modify if no duplicates present', () => {
    const items = makeItems(1000, 2000, 3000, 4000)
    organizeByTimestamp(items)
    expect(items).toEqual(makeItems(1000, 2000, 3000, 4000))
  })

  it('should remove fractions and regenerate fractions', () => {
    const items = makeItems(1000.11, 2000.22, 3000.33, 4000.44, 4000.55)
    organizeByTimestamp(items)
    expect(items).toEqual(makeItems(1000, 2000, 3000, 4000.01, 4000.02))
  })

  it('should add sequence number as fraction to duplicates', () => {
    const items = makeItems(1000, 2000, 3100, 3200, 3500, 4000, 4999, 5000)
    organizeByTimestamp(items)
    expect(items).toEqual(makeItems(1000, 2000, 3100.01, 3200.02, 3500.03, 4000.01, 4999.02, 5000))
  })

  it('should add fractions to duplicates with the last and first item being unique', () => {
    const items = makeItems(1000, 1000, 2000, 3000, 4000, 5000, 5000)
    organizeByTimestamp(items)
    expect(items).toEqual(makeItems(1000.01, 1000.02, 2000, 3000, 4000, 5000.01, 5000.02))
  })

  it('should sort by timestamp', () => {
    const items = makeItems(5000, 4000, 3000, 2000, 1000)
    organizeByTimestamp(items)
    expect(items).toEqual([
      { timestamp: 1000, path: '4' },
      { timestamp: 2000, path: '3' },
      { timestamp: 3000, path: '2' },
      { timestamp: 4000, path: '1' },
      { timestamp: 5000, path: '0' },
    ])
  })

  it('should stable sort items by timestamp', () => {
    const items = makeItems(1000, 2000, 3000, 2000, 2000)
    organizeByTimestamp(items)
    expect(items).toEqual([
      { timestamp: 1000, path: '0' },
      { timestamp: 2000.01, path: '1' },
      { timestamp: 2000.02, path: '3' },
      { timestamp: 2000.03, path: '4' },
      { timestamp: 3000, path: '2' },
    ])
  })
})

describe('calcMoveFileOps', () => {
  const makeFilePath = (timestamp: number) => `/path/${timestamp.toFixed(2)}`

  it('should do nothing if current path equals desired path', () => {
    const files = [
      { path: '/path/1.00', timestamp: 1 },
      { path: 2, timestamp: 2 },
    ]
    const { renameOps, moveOps } = calcMoveFileOps(files, makeFilePath)
    expect(renameOps).toHaveLength(0)
    expect(moveOps).toHaveLength(0)
  })

  it('should create moveOps if path does not match path calculated from timestamp', () => {
    const files = [
      { path: '/path/1.00', timestamp: 1.01 },
      { path: 2.0, timestamp: 2.01 },
    ]
    const { renameOps, moveOps } = calcMoveFileOps(files, makeFilePath)
    expect(renameOps).toHaveLength(0)
    expect(moveOps).toEqual([
      { from: '/path/1.00', to: '/path/1.01' },
      { from: '/path/2.00', to: '/path/2.01' },
    ])
  })

  it('should create renameOps if files are renamed to existing files', () => {
    const files = [
      { path: 'new.jpg', timestamp: 1.01 },
      { path: 1.01, timestamp: 1.02 },
      { path: 1.02, timestamp: 1.03 },
    ]
    const { renameOps, moveOps } = calcMoveFileOps(files, makeFilePath)
    expect(renameOps).toEqual([
      { from: '/path/1.01', to: '/path/1.01_' },
      { from: '/path/1.02', to: '/path/1.02_' },
    ])
    expect(moveOps).toEqual([
      { from: 'new.jpg', to: '/path/1.01' },
      { from: '/path/1.01_', to: '/path/1.02' },
      { from: '/path/1.02_', to: '/path/1.03' },
    ])
  })

  it('should create valid ops for cyclic renamed files', () => {
    const files = [
      { path: 1.0, timestamp: 1.01 },
      { path: 1.01, timestamp: 1.02 },
      { path: 1.02, timestamp: 1.0 },
    ]
    const { renameOps, moveOps } = calcMoveFileOps(files, makeFilePath)
    expect(renameOps).toEqual([
      { from: '/path/1.00', to: '/path/1.00_' },
      { from: '/path/1.01', to: '/path/1.01_' },
      { from: '/path/1.02', to: '/path/1.02_' },
    ])
    expect(moveOps).toEqual([
      { from: '/path/1.00_', to: '/path/1.01' },
      { from: '/path/1.01_', to: '/path/1.02' },
      { from: '/path/1.02_', to: '/path/1.00' },
    ])
  })
})
