import { readPhotoTimestamp } from './media-files'

describe('readPhotoTimestamp', () => {
  it('should not contain any fraction', async () => {
    const ts = await readPhotoTimestamp(
      '/home/christian/TestMedia/Photos/2017/11-November/20171130-202432-73.jpg',
    )
    expect(ts - Math.trunc(ts)).toEqual(0)
  })
})
