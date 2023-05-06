import { makeFileName, makePhotoFolderName, makeVideoFolderName } from './names'

describe('names', () => {
  it.each([
    ['2000-01-01', '2000/01-January'],
    ['2000-03-01', '2000/03-March'],
    ['2000-12-31', '2000/12-December'],
  ])('photo folder for timestamp %s should be "%s"', (date, expected) => {
    expect(makePhotoFolderName(Date.parse(date))).toBe(expected)
  })

  it.each([
    ['2000-01-01', '2000'],
    ['2001-03-01', '2001'],
    ['2002-12-31', '2002'],
  ])('video folder for timestamp %s should be "%s"', (date, expected) => {
    expect(makeVideoFolderName(Date.parse(date))).toBe(expected)
  })

  it.each([
    ['2000-01-01T02:01:01.100', 0, '.jpg', '20000101-020101.jpg'],
    ['2001-03-01T12:02:00.999', 1, '.jpg', '20010301-120200-01.jpg'],
    ['2002-06-15T13:10:20', 10, '.ext', '20020615-131020-10.ext'],
    ['2003-12-31T20:50:55', 99, '.ext', '20031231-205055-99.ext'],
  ])(
    'filename for timestamp %s with sequence number %i and extension %s should be "%s"',
    (ts, seq, type, expected) => {
      expect(makeFileName(Date.parse(ts) + seq / 100, type)).toBe(expected)
    },
  )
})
