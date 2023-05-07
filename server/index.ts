import cors from '@koa/cors'
import { appendFile, mkdirsSync, move, readJSON, writeJSON } from 'fs-extra'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { join, basename } from 'path'
import { makePhotoPathName } from 'lib/names'
import { photoRootPath } from 'lib/config'

const photos = process.env.PHOTOS ?? photoRootPath
const deletedPhotos = join(photos, '_deleted_')
mkdirsSync(deletedPhotos)

const app = new Koa()
app.use(cors()) // necessary for development because localhost:3000 is a different origin than localhost:9000
app.use(bodyParser())
app.use(async (ctx, next) => {
  if (ctx.path === '/index.json') return await next()

  const timestamp = Number.parseFloat(ctx.path.substring(1))
  if (isNaN(timestamp)) {
    ctx.status = 404
    return
  }
  ctx.path = makePhotoPathName(timestamp)
  if (ctx.method === 'DELETE') {
    deletePhoto(ctx.path, timestamp)
    ctx.body = 'OK'
  } else if (ctx.method === 'POST') {
    rotatePhoto(ctx.path, ctx.request.body)
    ctx.body = 'OK'
  } else {
    await next()
  }
})
app.use(serveStatic(photos, { maxAge: 5 * 60 * 1000 }))
app.use(serveStatic(__dirname))
app.onerror = (err: Error) => {
  // ignore ECONNRESET errors that happen if browser cancels download, e.g. when skipping fast through photos
  if (!err.message.includes('ECONNRESET')) console.error(err)
}
app.listen(9000)

function rotatePhoto(path: string, body: any) {
  const rotation = body.rotation ?? 0
  console.log('rotate', path, rotation)
  return appendFile(join(photos, 'rotated.txt'), `${path}\n`)
}

async function deletePhoto(path: string, timestamp: number) {
  move(join(photos, path), join(photos, '_deleted_', basename(path)))

  // update index
  const indexFileName = join(photos, 'index.json')
  const index: number[] = await readJSON(indexFileName)
  await writeJSON(
    indexFileName,
    index.filter((item) => item !== timestamp),
  )
}
