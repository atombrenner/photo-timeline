import fastify from 'fastify'
import staticFiles from 'fastify-static'

const server = fastify({ logger: true })

server.register(staticFiles, {
  root: '/home/christian/Data/MyMedia/Photos/',
  maxAge: 3600 * 1000,
})

server.get('/index.json', (req, res) => {
  req.log.info('send something else')
  res.sendFile('index.ts', __dirname)
})

server.delete('/20*', (req, res) => {
  res.code(200).send(`Deleted ${req.url}`)
})

server.post('/20*', async (req, res) => {
  res.code(200).send(`Rotated ${req.url}`)
})

server.get('/ping', (request, reply) => {
  //console.log(reply) // this is the http.ServerResponse with correct typings!
  reply.code(200).send({ pong: 'it worked!' })
})

server.listen(7777).catch(console.error)
