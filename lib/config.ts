import { join } from 'node:path'

export const mediaRootPath = '/home/christian/Data/MyMedia'
export const photoRootPath = join(mediaRootPath, 'Photos')
export const videoRootPath = join(mediaRootPath, 'Videos')

// define aliases for ingest sources when running `npx ingest <from>`
export const ingestSources = {
  camera: '/run/media/christian/9016-4EF8/DCIM/',
  pixel:
    '/run/user/1000/gvfs/mtp:host=Google_Pixel_4a__5G__0B161JECB14146/Interner gemeinsamer Speicher/DCIM/Camera',
}
