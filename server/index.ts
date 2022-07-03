import cors from '@koa/cors'
import { appendFile, mkdirsSync, move, readJson, writeJson } from 'fs-extra'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { join, basename } from 'path'

const photos = process.env.PHOTOS ?? join(__dirname, '..')
const deletedPhotos = join(photos, '_deleted_')
mkdirsSync(deletedPhotos)

const app = new Koa()
app.use(cors()) // necessary for development because localhost:3000 is a different origin than localhost:9000
app.use(bodyParser())
app.use(async (ctx, next) => {
  const path = decodeURIComponent(ctx.URL.pathname)
  if (ctx.method === 'DELETE') {
    deletePhoto(path)
    ctx.body = 'OK'
  } else if (ctx.method === 'POST') {
    rotatePhoto(path, ctx.request.body)
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

async function deletePhoto(path: string) {
  move(join(photos, path), join(photos, '_deleted_', basename(path)))
  const indexFile = join(photos, 'index.json')
  const itemToBeDeleted = path.substring(1) // remove leading slash
  const index: string[] = await readJson(indexFile)
  const indexWithPhotoRemoved = index.filter((item) => item !== itemToBeDeleted)
  await writeJson(indexFile, indexWithPhotoRemoved)
}
