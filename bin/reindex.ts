#!/usr/bin/env -S npx ts-node -T

import { resolve } from 'node:path'
import { readMediaFiles } from '../scripts/organize'
import { readFiles } from '../scripts/read'
import { PhotoPattern } from '../scripts/config'

console.log('reindex', process.argv.slice(2))

async function main() {
  // figure out if we want to reindex photos or videos

  // figure out if we want to specify the folder of the index

  // read all media files

  const testPhotos = resolve('~/TestMedia/Photos')

  const files = await readFiles(testPhotos, PhotoPattern)
  // return await readMediaFiles(files, getPhotoTimestamp, makePhotoFolderName)

  // create index

  // rename media files according to index if necessary

  // what could be the intermediate data structure?

  // {
  //   original: Timestamp // timestamp read from
  //   adjusted: Timestamp //
  // }

  // This works if there is no renaming. If we want to handle
  // renamed files we need to store the original file

  // {
  //   timestamp: number
  //   currentPath: string
  //   newPath: string
  // }

  // first we read timestamp and path
  // then we build the index (sort and deduplicate timestamps in place)
  // then we calculate the new Path from the timestamp
  // filter out all files that don't need to be moved
  // optimize rename operations
  //   a -> b
  //   b -> a
  //   in this case we need an intermediate move
  //   a -> _a
  //   b -> a
  //   _a -> b

  //   a -> b
  //   b -> c
  //   c -> a

  // simple idea, two pass resolution
  // first pass:
  // if the currentPath equals the newPath of another operation
  //   move file to a tmp (prefix with tmp_ for example) place
  // else move the file
  // second path:
  //   move tmp files
  // data structure needed: a map that contains all new Path
}

main().catch(console.error)
