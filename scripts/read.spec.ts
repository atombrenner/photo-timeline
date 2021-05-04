import { mkdirsSync } from 'fs-extra'
import { readFolders } from './read'

describe('readFolders', () => {
  it('should return only top level folders', async () => {
    const tmp = '/tmp/read.spect.ts'
    mkdirsSync(tmp + '/bla')
    mkdirsSync(tmp + '/bli/bla/blub')
    mkdirsSync(tmp + '/hulle')

    const folders = await readFolders(tmp)
    expect(folders.sort()).toEqual(['/bla', '/bli', '/hulle'].map((f) => tmp + f))
  })
})
