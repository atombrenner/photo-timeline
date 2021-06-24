import { mkdtempSync, mkdirs, existsSync, writeFile, move, writeFileSync } from 'fs-extra'
import { join } from 'path'
import { removeFoldersWithoutMediaFiles, moveFile } from './ingest'

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

describe('files must not be overwritten on move', () => {
  test('fs-extra move should not overwrite an existing file', async () => {
    const tmp = mkdtempSync('/tmp/move')
    const srcFile = join(tmp, 'src')
    const dstFile = join(tmp, 'dst')
    writeFileSync(srcFile, 'source content')
    writeFileSync(dstFile, 'destination content')

    expect(move(srcFile, dstFile)).rejects.toThrowError('dest already exists')
  })

  test('moveFile must not overwrite an existing file', async () => {
    const tmp = mkdtempSync('/tmp/move')
    const srcFile = join(tmp, 'src')
    const dstFile = join(tmp, 'dst')
    writeFileSync(srcFile, 'source content')
    writeFileSync(dstFile, 'destination content')

    expect(moveFile(srcFile, dstFile)).rejects.toThrowError('dest already exists')
  })
})
