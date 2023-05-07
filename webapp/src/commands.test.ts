import { nextMonth, prevMonth, nextDay, prevDay } from './commands'
import { next, prev, next10, prev10 } from './commands'
import { start } from './commands'

describe('skipN', () => {
  it('should return last image if there is no next or prev image', () => {
    const images = [1]
    expect(next(images, 0)).toEqual(0)
    expect(next10(images, 0)).toEqual(0)
    expect(prev(images, 0)).toEqual(0)
    expect(prev10(images, 0)).toEqual(0)
  })

  it('should return next image', () => {
    const images = [1, 2, 3]
    const nextImage = next(images, 0)
    expect(images[nextImage]).toEqual(2)
  })

  it('should return prev image', () => {
    const images = [1, 2, 3]
    const prevImage = prev(images, images.length - 1)
    expect(images[prevImage]).toEqual(2)
  })

  it('should return next10 image', () => {
    const images = Array<number>(10)
    images.fill(1)
    images.push(11, 12)
    const nextImage = next10(images, 0)
    expect(images[nextImage]).toEqual(11)
  })

  it('should return prev10 image', () => {
    const images = Array<number>(10)
    images.fill(12)
    images.unshift(0, 1)
    const nextImage = prev10(images, images.length - 1)
    expect(images[nextImage]).toEqual(1)
  })
})

describe('nextDay', () => {
  it('should return first image after the current day', () => {
    const images = ['2000-01-01', '2000-01-01', '2000-01-02', '2100-01-01'].map(Date.parse)
    const next = nextDay(images, 0)
    expect(images[next]).toEqual(Date.parse('2000-01-02'))
  })

  it('should return first image after the current day, example 2 ', () => {
    const images = ['2000-01-01', '2000-01-02', '2100-01-01'].map(Date.parse)
    const next = nextDay(images, 0)
    expect(next).toEqual(1)
  })

  it('should return last image if there is no next day', () => {
    const images = ['2000-01-01T01:00', '2000-01-01T02:00', '2000-01-01T03:00'].map(Date.parse)
    const next = nextDay(images, 0)
    expect(next).toEqual(images.length - 1)
  })
})

describe('prevDay', () => {
  it('should return first image before current day', () => {
    const images = ['2000-01-01', '2010-01-13', '2010-01-15', '2010-01-15'].map(Date.parse)
    const next = prevDay(images, images.length - 1)
    expect(images[next]).toEqual(Date.parse('2010-01-13'))
  })

  it('should return first image before current day, 2nd example', () => {
    const images = ['2000-01-01', '2010-01-13', '2010-01-15'].map(Date.parse)
    const next = prevDay(images, images.length - 1)
    expect(images[next]).toEqual(Date.parse('2010-01-13'))
  })

  it('should return first image if there are no images before current day', () => {
    const images = ['2000-01-01', '2010-01-15', '2010-01-15'].map(Date.parse)
    const next = prevDay(images, images.length - 1)
    expect(images[next]).toEqual(Date.parse('2000-01-01'))
  })
})

describe('nextMonth', () => {
  it('should return first image after current date plus one month', () => {
    const images = ['2000-01-15', '2000-02-14', '2000-02-15', '2010-01-15'].map(Date.parse)
    const next = nextMonth(images, 0)
    expect(images[next]).toEqual(Date.parse('2000-02-15'))
  })

  it('should return first image after current date plus one month, 2nd example', () => {
    const images = ['2000-01-15', '2000-02-15', '2010-01-15'].map(Date.parse)
    const next = nextMonth(images, 0)
    expect(images[next]).toEqual(Date.parse('2000-02-15'))
  })

  it('should return last image if there is no next month', () => {
    const images = ['2000-01-15 1', '2000-02-14 2'].map(Date.parse)
    const next = nextMonth(images, 0)
    expect(next).toEqual(images.length - 1)
  })
})

describe('prevMonth', () => {
  it('should return first image before current date minus one month', () => {
    const images = ['2000-01-15', '2010-01-14', '2010-01-17', '2010-02-15'].map(Date.parse)
    const next = prevMonth(images, images.length - 1)
    expect(images[next]).toEqual(Date.parse('2010-01-14'))
  })

  it('should return first image before current date minus one month, 2nd example', () => {
    const images = ['2000-01-15', '2010-01-14', '2010-02-15'].map(Date.parse)
    const next = prevMonth(images, images.length - 1)
    expect(images[next]).toEqual(Date.parse('2010-01-14'))
  })

  it('should return first image if there is no image before current date minus one month', () => {
    const images = ['2000-01-15', '2000-02-14'].map(Date.parse)
    const next = prevMonth(images, images.length - 1)
    expect(next).toEqual(0)
  })
})

describe('start', () => {
  it('should return first image of newest month', () => {
    const images = ['2000-01-01', '2000-02-05', '2000-02-06'].map(Date.parse)
    expect(start(images)).toEqual(1)
  })
})
