import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { join } from 'path'

const photos = process.env.PHOTOS ?? join(__dirname, '..')

const app = new Koa()
app.use(cors()) // necessary for development because localhost:3000 is a different origin than localhost:9000
app.use(bodyParser())
app.use(async (ctx, next) => {
  if (ctx.method === 'DELETE') {
    ctx.body = 'OK'
    console.log(decodeURIComponent(ctx.URL.pathname))
  } else if (ctx.method === 'POST') {
    ctx.body = 'OK'
    console.log(JSON.stringify(ctx.request.body))
  } else {
    await next()
  }
})
app.use(serveStatic(photos, { maxAge: 3600000 }))
app.use(serveStatic(__dirname))
app.listen(9000)
