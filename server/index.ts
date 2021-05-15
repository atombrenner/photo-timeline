import cors from '@koa/cors'
import { appendFile } from 'fs-extra'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { join } from 'path'

const photos = process.env.PHOTOS ?? join(__dirname, '..')

const app = new Koa()
app.use(cors()) // necessary for development because localhost:3000 is a different origin than localhost:9000
app.use(bodyParser())
app.use(async (ctx, next) => {
  const path = decodeURIComponent(ctx.URL.pathname)
  if (ctx.method === 'DELETE') {
    ctx.body = 'OK'
    console.log(decodeURIComponent(ctx.URL.pathname))
  } else if (ctx.method === 'POST') {
    rotate(path, ctx.request.body.rotation ?? 0)
    ctx.body = 'OK'
  } else {
    await next()
  }
})
app.use(serveStatic(photos, { maxAge: 3600000 }))
app.use(serveStatic(__dirname))
app.listen(9000)

function rotate(path: string, rotation: number) {
  console.log('rotate', path, rotation)
  return appendFile(join(photos, 'rotated.txt'), `${path}\n`)
}
