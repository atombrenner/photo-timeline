import { getMonth, nextMonth, prevMonth, nextYear, prevYear } from './commands'

test('getMonth() should return month from image path', () => {
  const month = getMonth('/bli/2019-09-23 001')
  expect(month).toEqual('2019-09')
})

const images = [
  '/2000-01-01 001',
  '/2000-02-01 001',
  '/2000-02-02 003',
  '/2010-05-13 001',
  '/2010-05-13 002',
  '/2010-06-03 001',
  '/2010-06-05 002',
  '/2010-06-05 003',
  '/2010-07-04 002',
  '/2010-07-13 003',
  '/2011-03-01 001',
  '/2011-05-02 002',
  '/2011-05-03 003',
  '/2011-07-15 004',
  '/2011-08-01 005',
]

const imagesOneMonth = ['/2020-01-01 001', '/2020-01-01 002']

describe('nextMonth()', () => {
  it('should return index of first image of next month', () => {
    const index = nextMonth(images, images.indexOf('/2010-06-03 001'))
    expect(images[index]).toEqual('/2010-07-04 002')
  })

  it('should return index of first image if there is no next month', () => {
    const index = nextMonth(images, images.length - 1)
    expect(index).toEqual(0)
  })

  it('should return current index if all images are in the same month', () => {
    expect(nextMonth(imagesOneMonth, 0)).toEqual(0)
    expect(nextMonth(imagesOneMonth, 1)).toEqual(1)
  })
})

describe('prevMonth()', () => {
  it('should return index of first image of current month if current image is not the first one', () => {
    const index = prevMonth(images, images.indexOf('/2010-05-13 002'))
    expect(images[index]).toEqual('/2010-05-13 001')
  })

  it('should return index of first image of previous month', () => {
    const index = prevMonth(images, images.indexOf('/2010-05-13 001'))
    expect(images[index]).toEqual('/2000-02-01 001')
  })

  it('should return index of first image if all images are in the same month', () => {
    expect(prevMonth(imagesOneMonth, 0)).toEqual(0)
    expect(prevMonth(imagesOneMonth, 1)).toEqual(0)
  })
})

describe('nextYear()', () => {
  it('should return index of first image of same month in next year', () => {
    const index = nextYear(images, images.indexOf('/2010-05-13 002'))
    expect(images[index]).toEqual('/2011-05-02 002')
  })

  it('should return current index if there is no next year', () => {
    expect(nextYear(imagesOneMonth, 0)).toEqual(0)
    expect(nextYear(imagesOneMonth, 1)).toEqual(1)
    expect(nextYear(images, images.length - 2)).toEqual(images.length - 2)
  })
})

describe('prevYear()', () => {
  it('should return index of first image of same month in previous year', () => {
    const index = prevYear(images, images.indexOf('/2011-07-15 004'))
    expect(images[index]).toEqual('/2010-07-04 002')
  })

  it('should return current index if there is no previous year', () => {
    expect(nextYear(imagesOneMonth, 0)).toEqual(0)
    expect(nextYear(imagesOneMonth, 1)).toEqual(1)
    expect(prevYear(images, 2)).toEqual(2)
  })
})
