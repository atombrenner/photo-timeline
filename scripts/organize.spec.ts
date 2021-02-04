import { makeFileName } from './names'
import { calcMoveCommands, organizeFolder } from './organize'

describe('organizeFolder', () => {
  const files = [{ created: 100 }, { created: 1 }, { created: 10 }]
  const moreFiles = [{ created: 1000 }, { created: 3000 }, { created: 2000 }]

  it('should sort files', () => {
    const filesInFolder = organizeFolder(files, [], 'jpg')
    expect(filesInFolder.map((f) => f.created)).toEqual([1, 10, 100])
  })

  it('should concat and sort files', () => {
    const filesInFolder = organizeFolder(files, moreFiles, 'jpg')
    expect(filesInFolder.map((f) => f.created)).toEqual([1, 10, 100, 1000, 2000, 3000])
  })

  it('should attach file name', () => {
    const filesInFolder = organizeFolder([{ created: 100000 }], [{ created: 200000 }], 'jpg')

    expect(filesInFolder[0].file).toEqual(makeFileName(100000, 0, 'jpg'))
    expect(filesInFolder[1].file).toEqual(makeFileName(200000, 1, 'jpg'))
  })
})

describe('calcMoveCommands', () => {
  const root = '/root'

  const makeMediaFile = (n: number) => ({
    created: n,
    path: `/path/${n}.jpg`,
    folder: 'some/folder',
    file: `file_${n + 1}.jpg`,
  })

  it('should throw if not all files have the same foler', () => {
    const files = [makeMediaFile(1), { ...makeMediaFile(2), folder: 'different/folder' }]
    expect(() => calcMoveCommands(files, root)).toThrowError()
  })

  it('should drop files which do not need to be moved', () => {
    const files = [0, 1, 2, 3, 4].map(makeMediaFile)
    files[0].path = '/root/some/folder/file_1.jpg'

    const commands = calcMoveCommands(files, root)
    expect(commands).toHaveLength(4)
    expect(commands.map((c) => c.from)).not.toContain('/root/some/folder/file_1.jpg')
  })

  it('should not move to existing files', () => {
    const files = [
      {
        path: '/root/some/folder/file_1.jpg',
      },
    ]
    expect(true).toBe(false)
  })
})
