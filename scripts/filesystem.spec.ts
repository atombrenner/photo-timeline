import {
  createFileSync,
  existsSync,
  mkdirpSync,
  mkdtempSync,
  readdirSync,
  removeSync,
} from 'fs-extra'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { listFiles, removeEmptyFolders } from './filesystem'

const tmp = mkdtempSync(join(tmpdir(), 'specs-'))

afterEach(() => {
  removeSync(tmp)
})

const createTmpFile = (...paths: string[]) => {
  const path = join(tmp, ...paths)
  createFileSync(path)
  return path
}

describe('listFiles', () => {
  it('should return a full path to each file that starts with the root path', async () => {
    createTmpFile('folder', 'file.test')
    const files = await listFiles(tmp, /.*/)
    expect(files).toEqual([join(tmp, 'folder', 'file.test')])
  })

  it('should recursively read all files that match the given pattern', async () => {
    const expectedFiles = []
    createTmpFile('.ignore', 'no.jpeg')
    createTmpFile('_ignore_', 'no.jpeg')
    createTmpFile('t.txt')
    expectedFiles.push(createTmpFile('f1.jpeg'))
    expectedFiles.push(createTmpFile('f2.jpeg'))
    expectedFiles.push(createTmpFile('a', 'f4.jpeg'))
    expectedFiles.push(createTmpFile('a', 'aa', 'aaa', 'f3.jpeg'))
    expectedFiles.push(createTmpFile('a', 'bb', 'f5.jpeg'))
    expectedFiles.push(createTmpFile('a', 'bb', 'f6.jpeg'))
    createTmpFile('a', 'bb', 't.txt')
    mkdirpSync(join(tmp, 'a', 'bb', 'bbb')) // empty leave folder

    const files = await listFiles(tmp, /\.jpeg$/)
    expect(files).toEqual(expectedFiles.sort())
  })
})

describe('removeEmptyFolders', () => {
  it('can trust readdir to not return special folders like "." and ".."', () => {
    createTmpFile('file.jpeg')
    const dir = readdirSync(tmp)
    expect(dir).toEqual(['file.jpeg'])
  })

  it('should remove empty folder', async () => {
    const folder = join(tmp, 'a')
    mkdirpSync(folder)

    const result = await removeEmptyFolders(folder)
    expect(result).toEqual(true)
    expect(existsSync(folder)).toEqual(false)
  })

  it('should remove empty folders recursively', async () => {
    const folder = join(tmp, 'folder')
    mkdirpSync(folder)
    const subFolders = [['a'], ['b', 'bb'], ['c', 'cc', 'ccc']]
    subFolders.forEach((f) => mkdirpSync(join(folder, ...f)))
    expect(readdirSync(folder)).toEqual(['a', 'b', 'c'])

    const result = await removeEmptyFolders(folder)
    expect(result).toEqual(true)
    expect(existsSync(folder)).toEqual(false)
  })

  it('should not remove ignored folders', async () => {
    const folder = join(tmp, 'folder')
    mkdirpSync(folder)
    const subFolders = [['a'], ['b', '.ignore'], ['c', '_ignore_', 'ccc']]
    subFolders.forEach((f) => mkdirpSync(join(folder, ...f)))
    expect(readdirSync(folder)).toEqual(['a', 'b', 'c'])

    const result = await removeEmptyFolders(folder)
    expect(result).toEqual(false)
    expect(existsSync(folder)).toEqual(true)
    expect(existsSync(join(folder, 'a'))).toEqual(false)
    expect(existsSync(join(folder, 'b'))).toEqual(true)
    expect(existsSync(join(folder, 'c'))).toEqual(true)
  })

  it('should not remove a folder containing files', async () => {
    const folder = join(tmp, 'folder')
    const file = createTmpFile('folder', 'file.jpeg')
    expect(existsSync(file)).toEqual(true)

    const result = await removeEmptyFolders(folder)
    expect(result).toEqual(false)
    expect(existsSync(file)).toEqual(true)
  })

  it('should not remove a folder recursively containing files', async () => {
    const folder = join(tmp, 'folder')
    const file = createTmpFile('folder', 'a', 'aa', 'file.jpeg')
    const emptyFolder = join(folder, 'b')
    mkdirpSync(emptyFolder)
    expect(existsSync(emptyFolder))

    const result = await removeEmptyFolders(folder)
    expect(result).toEqual(false)
    expect(existsSync(file)).toEqual(true)
    expect(existsSync(emptyFolder)).toEqual(false)
  })
})
