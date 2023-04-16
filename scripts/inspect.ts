#!/usr/bin/env -S npx ts-node -T
import { basename } from 'node:path'
import { PhotoPattern, PhotoRoot } from './config'
import { readFiles } from './read'
import { readPhotoCreationDate } from './read-creation-date'

async function checkCreationDateUniqueness() {
  const photos = new Map<number, string>()
  const files = await readFiles(PhotoRoot, PhotoPattern)
  const chunks = 8
  const chunkSize = Math.round(files.length / chunks)
  const duplicates: string[] = []

  const processChunk = async (start: number) => {
    const stop = Math.min(start + chunkSize, files.length)
    for (let i = start; i < stop; ++i) {
      const file = files[i]
      const date = await readPhotoCreationDate(file)
      if (photos.get(date)) {
        duplicates.push(
          `${new Date(date).toISOString()}: ${basename(file)} has the same timestamp as ${basename(
            photos.get(date)!,
          )}`,
        )
      } else {
        photos.set(date, file)
      }
    }
  }

  const jobs: Promise<void>[] = []
  for (let i = 0; i < chunks; ++i) {
    jobs.push(processChunk(i * chunkSize))
  }
  await Promise.all(jobs)
  console.log(duplicates.sort().join('\n'))
  console.log(files.length, photos.size)
  console.log('done')
}

checkCreationDateUniqueness().catch(console.error)
