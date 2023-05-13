import { existsSync } from 'node:fs'
import { join } from 'node:path'

const myMedia = process.env.MY_MEDIA
if (!myMedia || !existsSync(myMedia)) {
  console.error('MY_MEDIA environment variable is not defined')
  process.exit(1)
}

export const mediaRootPath = myMedia
export const photoRootPath = join(mediaRootPath, 'Photos')
export const videoRootPath = join(mediaRootPath, 'Videos')

// define aliases for ingest sources when running `npx ingest <from>`
export const ingestSources = {
  camera: '/run/media/christian/9016-4EF8/DCIM/',
  pixel:
    '/run/user/1000/gvfs/mtp:host=Google_Pixel_4a__5G__0B161JECB14146/Interner gemeinsamer Speicher/DCIM/Camera',
}
