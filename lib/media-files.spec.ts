import { join } from 'node:path'
import { readPhotoTimestamp } from './media-files'

const testData = join(__dirname, 'test-data')

describe('readPhotoTimestamp', () => {
  it('should truncate any fraction from timestamp', async () => {
    // nanoseconds.jpg contains Exif SubSecTimeOriginal=123456
    const ts = await readPhotoTimestamp(join(testData, 'nanoseconds.jpg'))
    expect(ts).toEqual(Date.parse('2000-01-02T03:04:05.123Z'))
  })

  it('should use image ModifyDate if DateTimeOriginal is missing', async () => {
    const ts = await readPhotoTimestamp(join(testData, 'no-original-date.jpg'))
    expect(ts).toEqual(Date.parse('2000-01-02T03:04:05Z'))
  })

  it('should throw if neither ModifyDate nor DateTimeOriginal can be found', async () => {
    const ts = readPhotoTimestamp(join(testData, 'no-dates.jpg'))
    await expect(ts).rejects.toThrowError('no photo timestamp')
  })
})
