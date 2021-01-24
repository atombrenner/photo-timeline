import fs from 'fs/promises'

import { readdir } from 'fs-extra'

readdir('/home/christian/Photos/2002', { withFileTypes: true }).then((entries) =>
  entries.map((e) => (e.isDirectory() ? 'dir' : 'other')),
)

fs.readFile('/home/christian/Photos/2002/01%20Januar/2002-01-01-001.jpg').then(() =>
  console.log('found'),
)

console.log('hello world')
