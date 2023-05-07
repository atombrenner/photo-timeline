import { join } from 'node:path'

export const mediaRootPath = '/home/christian/Data/MyMedia'
export const photoRootPath = join(mediaRootPath, 'Photos')
export const videoRootPath = join(mediaRootPath, 'Videos')

export const ingestSources = {
  camera: '/run/media/christian/9016-4EF8/DCIM/',
}
