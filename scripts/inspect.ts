#!/usr/bin/env -S npx ts-node -T
import { format } from 'date-fns'
import { PhotoPattern, PhotoRoot } from './config'
import { listFiles } from './filesystem'
import { readPhotoTimestamp } from './media-files'

const truncSecond = (ts: number) => Math.trunc(ts / 1000) * 1000

async function checkCreationDateUniqueness() {
  const photos = new Map<number, number>()
  const files = await listFiles(PhotoRoot, PhotoPattern)
  console.log(`inspecting ${files.length} files`)
  const chunks = 8
  const chunkSize = Math.round(files.length / chunks)

  const processChunk = async (start: number) => {
    const stop = Math.min(start + chunkSize, files.length)
    for (let i = start; i < stop; ++i) {
      const file = files[i]
      const ts = truncSecond(await readPhotoTimestamp(file))
      const count = photos.get(ts)
      if (count) {
        photos.set(ts, count + 1)
      } else {
        photos.set(ts, 1)
      }
    }
  }

  const jobs: Promise<void>[] = []
  for (let i = 0; i < chunks; ++i) {
    jobs.push(processChunk(i * chunkSize))
  }
  await Promise.all(jobs)

  let duplicateCount = 0
  for (const [ts, count] of Array.from(photos.entries()).sort((a, b) => a[0] - b[0])) {
    if (count > 1) {
      console.log(`${count} duplicates for ${format(ts, 'yyyyMMdd_HHmmss') + '_00.jpg'}`)
      ++duplicateCount
    }
  }
  console.log(`found ${duplicateCount} timestamps with more than one photo`)
}

checkCreationDateUniqueness().catch(console.error)
