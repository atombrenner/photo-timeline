import { mkdtempSync, mkdirs, existsSync, writeFile } from 'fs-extra'
import { removeFoldersWithoutMediaFiles } from './ingest'

const log = console.log

beforeAll(() => {
  console.log = jest.fn()
})

afterAll(() => {
  console.log = log
})

describe('removeFoldersWithoutMediaFiles', () => {
  const tmp = mkdtempSync('/tmp/DCIM')

  it('should remove recursively all empty folders', async () => {
    await mkdirs(tmp + '/bli/bla/blub')
    await mkdirs(tmp + '/hulle/bulle')

    await removeFoldersWithoutMediaFiles(tmp)

    expect(existsSync(tmp)).toBeFalsy()
  })

  it('should not remove folders with photos', async () => {
    await mkdirs(tmp + '/bli/bla/blub')
    await mkdirs(tmp + '/hulle/bulle')
    await writeFile(tmp + '/hulle/photo.jpg', 'data')

    await removeFoldersWithoutMediaFiles(tmp)

    expect(existsSync(tmp)).toBeTruthy()
  })
})
