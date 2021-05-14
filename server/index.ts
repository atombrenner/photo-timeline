import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { join } from 'path'

const photos = process.env.PHOTOS ?? join(__dirname, '..')

const app = new Koa()
app.use(bodyParser())
app.use(cors())
app.use(async (ctx, next) => {
  if (ctx.method === 'DELETE') {
    ctx.body = 'deleted'
    console.log(decodeURIComponent(ctx.URL.pathname))
  } else if (ctx.method === 'POST') {
    ctx.body = JSON.stringify(ctx.request.body)
  } else {
    await next()
  }
})
app.use(serveStatic(photos, { maxAge: 3600000 }))
app.use(serveStatic(__dirname))
app.listen(9000)
