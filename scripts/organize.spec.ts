import { makeFileName } from './names'
import {
  assertAllFilesHaveSameFolder,
  calcMoveCommands,
  FinalMediaFile,
  MediaFile,
  mergeFilesInFolder,
} from './organize'

function fakeMediaFile(created: number, number = 0): MediaFile {
  return {
    path: `${created}-${number}.jpg`,
    created,
    folder: '',
  }
}

describe.skip('organizeFolder', () => {
  const files = [fakeMediaFile(100), fakeMediaFile(1), fakeMediaFile(10)]
  const moreFiles = [fakeMediaFile(1000), fakeMediaFile(3000), fakeMediaFile(2000)]

  it('should sort files', () => {
    const filesInFolder = mergeFilesInFolder(files, [])
    expect(filesInFolder.map((f) => f.created)).toEqual([1, 10, 100])
  })

  it('should concat and sort files', () => {
    const filesInFolder = mergeFilesInFolder(files, moreFiles)
    expect(filesInFolder.map((f) => f.created)).toEqual([1, 10, 100, 1000, 2000, 3000])
  })

  it('should stable sort files with equal creation date', () => {
    const files = [
      fakeMediaFile(100, 1),
      fakeMediaFile(100, 2),
      fakeMediaFile(100, 3),
      fakeMediaFile(200, 4),
    ]
    const filesInFolder = mergeFilesInFolder(files, files).map((f) => f.path)
    expect(filesInFolder).toEqual(['100-1.jpg', '100-2.jpg', '100-3.jpg', '200-4.jpg'])
  })

  it('should attach file name', () => {
    const filesInFolder = mergeFilesInFolder([fakeMediaFile(100000)], [fakeMediaFile(200000)])

    expect(filesInFolder[0].file).toEqual(makeFileName(100000, '.jpg'))
    expect(filesInFolder[1].file).toEqual(makeFileName(200000, '.jpg'))
  })
})

const fakeFinalMediaFile = (from: number): FinalMediaFile => ({
  created: from,
  path: `/path/${from}.jpg`,
  folder: 'some/folder',
  file: `file_${from + 1}.jpg`,
})

it('should throw if not all files have the same folder', () => {
  const files = [fakeFinalMediaFile(1), { ...fakeFinalMediaFile(2), folder: 'different/folder' }]
  expect(() => assertAllFilesHaveSameFolder(files)).toThrowError()
})

describe.skip('calcMoveCommands', () => {
  const root = '/root'

  it('should drop files which do not need to be moved', () => {
    const files = [0, 1, 2, 3, 4].map(fakeFinalMediaFile)
    files[0].path = '/root/some/folder/file_1.jpg'

    const commands = calcMoveCommands(files, root)
    expect(commands).toHaveLength(4)
    expect(commands.map((c) => c.from)).not.toContain('/root/some/folder/file_1.jpg')
  })

  const makeMovedMediaFile = ([from, to]: number[]): FinalMediaFile => ({
    created: 0,
    path: `/f/${from}`,
    folder: 'f',
    file: `${to}`,
  })

  it('should generate intermediate copy command to break lock', () => {
    const files = [
      [2, 1],
      [1, 2],
    ].map(makeMovedMediaFile)
    const commands = calcMoveCommands(files, '/')
    expect(commands).toStrictEqual([
      { from: '/f/2', to: '/f/1.parked' },
      { from: '/f/1', to: '/f/2' },
      { from: '/f/1.parked', to: '/f/1' },
    ])
  })

  it('should generate intermediate copy commands to break locks', () => {
    const files = [
      [2, 1],
      [1, 2],
      [4, 3],
      [3, 4],
    ].map(makeMovedMediaFile)
    const commands = calcMoveCommands(files, '/')
    expect(commands).toStrictEqual([
      { from: '/f/2', to: '/f/1.parked' },
      { from: '/f/1', to: '/f/2' },
      { from: '/f/1.parked', to: '/f/1' },
      { from: '/f/3', to: '/f/4.parked' },
      { from: '/f/4', to: '/f/3' },
      { from: '/f/4.parked', to: '/f/4' },
    ])
  })

  it('should handle copy up', () => {
    const files = [
      [1, 2],
      [2, 3],
      [3, 4],
    ].map(makeMovedMediaFile)
    const commands = calcMoveCommands(files, '/')
    expect(commands).toStrictEqual([
      { from: '/f/3', to: '/f/4' },
      { from: '/f/2', to: '/f/3' },
      { from: '/f/1', to: '/f/2' },
    ])
  })

  it('should handle copy down', () => {
    const files = [
      [4, 3],
      [3, 2],
      [2, 1],
    ].map(makeMovedMediaFile)
    const commands = calcMoveCommands(files, '/')
    expect(commands).toStrictEqual([
      { from: '/f/2', to: '/f/1' },
      { from: '/f/3', to: '/f/2' },
      { from: '/f/4', to: '/f/3' },
    ])
  })
})
