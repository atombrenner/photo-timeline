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
    const array: number[] = []
    for (let i = 0; i < 1_000_000; ++i) {
      array.push(Math.random() * (max - min) + min)
    }
    console.time('sort')
    array.sort()
    console.timeEnd('sort')
    array.push(max + 1)
    array.push(max + 2)
    array.push(max + 3)
    array.push(max + 4)
    array.push(max + 5)
    console.time('appendSort')
    array.sort()
    console.timeEnd('appendSort')
    console.time('Math.floor')
    for (let i = 0; i < array.length; ++i) {
      array[i] = Math.floor(array[i])
    }
    console.timeEnd('Math.floor')
  })
})
