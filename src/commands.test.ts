import { nextMonth, prevMonth, nextYear, prevYear, nextDay, prevDay, nextWeek } from './commands'
import { next, prev, next10, prev10 } from './commands'

describe('nextN', () => {
  it('should return last image if there is no next or prev image', () => {
    const images = ['/2000-01-01 1']
    expect(next(images, 0)).toEqual(0)
    expect(next10(images, 0)).toEqual(0)
    expect(prev(images, 0)).toEqual(0)
    expect(prev10(images, 0)).toEqual(0)
  })

  it('should return next image', () => {
    const images = ['/2000-01-01 1', '/2000-01-01 2', '/2000-01-02 3']
    const nextImage = next(images, 0)
    expect(images[nextImage]).toEqual('/2000-01-01 2')
  })

  it('should return prev image', () => {
    const images = ['/2000-01-01 1', '/2000-01-01 2', '/2000-01-02 3']
    const prevImage = prev(images, images.length - 1)
    expect(images[prevImage]).toEqual('/2000-01-01 2')
  })

  it('should return next10 image', () => {
    const images = Array<string>(10)
    images.fill('/2000-01-01 1')
    images.push('/2000-01-01 11', '/2000-01-02 12')
    const nextImage = next10(images, 0)
    expect(images[nextImage]).toEqual('/2000-01-01 11')
  })

  it('should return prev10 image', () => {
    const images = Array<string>(10)
    images.fill('/2000-02-01 12')
    images.unshift('/2000-01-01 0', '/2000-01-02 1')
    const nextImage = prev10(images, images.length - 1)
    expect(images[nextImage]).toEqual('/2000-01-02 1')
  })
})

describe('nextDay', () => {
  it('should return first image after the current day', () => {
    const images = ['/2000-01-01 1', '/2000-01-01 2', '/2000-01-02 3', '/2100-01-01 3']
    const next = nextDay(images, 0)
    expect(images[next]).toEqual('/2000-01-02 3')
  })

  it('should return first image after the current day, example 2 ', () => {
    const images = ['/2000-01-01 1', '/2000-01-02 2', '/2100-01-01 3']
    const next = nextDay(images, 0)
    expect(images[next]).toEqual('/2000-01-02 2')
  })

  it('should return last image if there is no next day', () => {
    const images = ['/2000-01-01 1', '/2000-01-01 2', '/2000-01-01 3']
    const next = nextDay(images, 0)
    expect(images[next]).toEqual('/2000-01-01 3')
  })
})

describe('prevDay', () => {
  it('should return first image before current day', () => {
    const images = ['/2000-01-01 1', '/2010-01-13 2', '/2010-01-15 3', '/2010-01-15 4']
    const next = prevDay(images, images.length - 1)
    expect(images[next]).toEqual('/2010-01-13 2')
  })

  it('should return first image before current day, 2nd example', () => {
    const images = ['/2000-01-01 1', '/2010-01-13 2', '/2010-01-15 3']
    const next = prevDay(images, images.length - 1)
    expect(images[next]).toEqual('/2010-01-13 2')
  })

  it('should return first image if there are no images before current day', () => {
    const images = ['/2000-01-01 1', '/2010-01-15 2', '/2010-01-15 3']
    const next = prevDay(images, images.length - 1)
    expect(images[next]).toEqual('/2000-01-01 1')
  })
})

describe('nextMonth', () => {
  it('should return first image after current date plus one month', () => {
    const images = ['/2000-01-15 1', '/2000-02-14 2', '/2000-02-15 3', '/2010-01-15 4']
    const next = nextMonth(images, 0)
    expect(images[next]).toEqual('/2000-02-15 3')
  })

  it('should return first image after current date plus one month, 2nd example', () => {
    const images = ['/2000-01-15 1', '/2000-02-15 2', '/2010-01-15 3']
    const next = nextMonth(images, 0)
    expect(images[next]).toEqual('/2000-02-15 2')
  })

  it('should return last image if there is no next month', () => {
    const images = ['/2000-01-15 1', '/2000-02-14 2']
    const next = nextMonth(images, 0)
    expect(images[next]).toEqual('/2000-02-14 2')
  })
})

describe('prevMonth', () => {
  it('should return first image before current date minus one month', () => {
    const images = ['/2000-01-15 1', '/2010-01-14 2', '/2010-01-17 3', '/2010-02-15 4']
    const next = prevMonth(images, images.length - 1)
    expect(images[next]).toEqual('/2010-01-14 2')
  })

  it('should return first image before current date minus one month, 2nd example', () => {
    const images = ['/2000-01-15 1', '/2010-01-14 2', '/2010-02-15 3']
    const next = prevMonth(images, images.length - 1)
    expect(images[next]).toEqual('/2010-01-14 2')
  })

  it('should return first image if there is no image before current date minus one month', () => {
    const images = ['/2000-01-15 1', '/2000-02-14 2']
    const next = prevMonth(images, images.length - 1)
    expect(images[next]).toEqual('/2000-01-15 1')
  })
})
