import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'

const app = new Koa()
app.use(bodyParser())
app.use(async (ctx, next) => {
  if (ctx.method === 'DELETE') {
    ctx.body = 'deleted'
  } else if (ctx.method === 'POST') {
    ctx.body = JSON.stringify(ctx.request.body)
  } else {
    await next()
  }
})
app.use(serveStatic('/home/christian/Data/MyMedia/Photos/', { maxAge: 3600000 }))
app.listen(7777)
