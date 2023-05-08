#!/usr/bin/env -S npx ts-node -T

import { format } from 'date-fns'
import { readPhotoFiles } from 'lib/media-files'
import { photoRootPath } from 'lib/config'

const toSecond = (ts: number) => Math.trunc(ts / 1000)

async function main() {
  // checkCreationDateUniqueness
  const photosPerSecond = new Map<number, number>()
  const files = await readPhotoFiles(photoRootPath)

  for (let i = 0; i < files.length; ++i) {
    const second = toSecond(files[i].timestamp)
    const count = photosPerSecond.get(second)
    if (count) {
      photosPerSecond.set(second, count + 1)
    } else {
      photosPerSecond.set(second, 1)
    }
  }

  let duplicateCount = 0
  let total = 0
  for (const [second, count] of Array.from(photosPerSecond.entries()).sort((a, b) => a[0] - b[0])) {
    if (count > 1) {
      console.log(`${count} photos for ${format(second * 1000, 'yyyy-MM-dd HH:mm:ss')}`)
      ++duplicateCount
      total += count
    }
  }
  console.log(`found ${duplicateCount} seconds with more than one photo, ${total} photos in total`)
}

main().catch((err) => {
  console.error(`${err}`)
  process.exit(1)
})
