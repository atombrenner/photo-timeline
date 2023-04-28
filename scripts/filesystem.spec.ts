import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { listFiles, listFolders } from './filesystem'

const tmp = mkdtempSync(join(tmpdir(), 'read.spec-'))

afterEach(() => {
  rmSync(tmp, { force: true, recursive: true })
})

const createTmpFile = (...paths: string[]) => {
  const file = paths.pop()
  if (!file) throw Error('no tmp file path')
  mkdirSync(join(tmp, ...paths), { recursive: true })
  const path = join(tmp, ...paths, file)
  writeFileSync(path, '')
  return path
}

describe('listFolders', () => {
  it('should return only top level folders', async () => {
    mkdirSync(join(tmp, 'a'), { recursive: true })
    mkdirSync(join(tmp, 'b', 'bb', 'bbb'), { recursive: true })
    mkdirSync(join(tmp, 'c'), { recursive: true })

    const folders = await listFolders(tmp)
    expect(folders).toEqual(['a', 'b', 'c'].map((f) => join(tmp, f)))
  })
})

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
    mkdirSync(join(tmp, 'a', 'bb', 'bbb'), { recursive: true }) // empty leave folder

    const files = await listFiles(tmp, /\.jpeg$/)
    expect(files).toEqual(expectedFiles.sort())
  })
})
