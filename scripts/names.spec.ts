import { makeFileName, makeFolderName } from './names'

describe('makeFolderName', () => {
  it.each([
    [new Date('2000-01-01'), '2000/01 Januar'],
    [new Date('2000-03-01'), '2000/03 März'],
    [new Date('2000-12-31'), '2000/12 Dezember'],
  ])('creationDate %s should be formated as %s', (creationDate, expected) => {
    expect(makeFolderName(+creationDate)).toBe(expected)
  })
})

describe('makeFileName', () => {
  it.each([
    [new Date('2000-01-01'), 0, 'jpg', '2000-01-01 001.jpg'],
    [new Date('2001-03-01'), 10, 'jpg', '2001-03-01 011.jpg'],
    [new Date('2002-06-15'), 10, 'mpg', '2002-06-15 011.mpg'],
    [new Date('2003-12-31'), 998, 'ext', '2003-12-31 999.ext'],
  ])(
    'creationDate %s with index %i should be formated as %s',
    (creationDate, index, type, expected) => {
      expect(makeFileName(+creationDate, index, type)).toBe(expected)
    },
  )
})
