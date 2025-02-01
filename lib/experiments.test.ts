type ArrayItem = { k: number; id: number }
const toId = (item: ArrayItem) => item.id

describe('stable sort', () => {
  it('should not change the relative order of items', () => {
    const array: ArrayItem[] = [
      { k: 1, id: 1 },
      { k: 2, id: 2 },
      { k: 2, id: 3 },
      { k: 2, id: 4 },
      { k: 5, id: 5 },
    ]
    array.sort((a, b) => a.k - b.k)
    expect(array.map(toId)).toEqual([1, 2, 3, 4, 5])
    array.push({ k: 3, id: 6 })
    array.push({ k: 2, id: 7 })
    array.push({ k: 2, id: 8 })
    array.sort((a, b) => a.k - b.k)
    expect(array.map(toId)).toEqual([1, 2, 3, 4, 7, 8, 6, 5])
  })
})

describe.skip('one million media files', () => {
  it('should give a feeling for performance', () => {
    const min = Date.parse('2000')
    const max = Date.parse('2050')
    // const array = new Array(1_000_000 + 5)
    const array = new Float64Array(1_000_000 + 5) // a Float64Array is ten times faster than a normal array
    for (let i = 0; i < 1_000_000; ++i) {
      array[i] = Math.random() * (max - min) + min
    }
    console.time('sort')
    array.sort()
    console.timeEnd('sort')
    array[1_000_000] = max / 2 + 1
    array[1_000_001] = max / 2 + 1
    array[1_000_002] = max / 2 + 1
    array[1_000_003] = max / 2 + 1
    array[1_000_004] = max / 2 + 1
    //  array.push(max + 1)
    //  array.push(max + 2)
    //  array.push(max + 3)
    //  array.push(max + 4)
    //  array.push(max + 5)
    console.time('appendSort')
    array.sort()
    console.timeEnd('appendSort') // append sort (new entries at the end is 4 times faster than at the beginning)
    console.time('stringify')
    JSON.stringify(array)
    console.timeEnd('stringify')
  })
})

describe('encode timestamp and sequence in one float64 number', () => {
  it('should be numerical exact for the year 2100 with three-digit fraction', () => {
    const timestamp = Date.parse('2100')
    for (let i = 1; i < 1000; ++i) {
      const parsed = JSON.parse(JSON.stringify(timestamp + i / 1000))
      const seq = parsed.toFixed(3).split('.')[1]
      expect(seq).toEqual(i.toString().padStart(3, '0'))
    }
  })
})
