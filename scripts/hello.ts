import { readdir } from 'fs-extra'

readdir('/home/christian/Photos').then(console.log)

console.log('hello world')
