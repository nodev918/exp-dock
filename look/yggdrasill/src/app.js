require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const app = express()
const redisAdapter = require('socket.io-redis')
const { get } = require('lodash')
const v8 = require('v8')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const logger = require('./logger')
const logUtils = require('./utils/log')
const commonUtils = require('./utils/common')
const redis = require('../src/datasource/redis')
const memcached = require('../src/datasource/memcached')
const portiere = require('../src/datasource/portiere')
const gravitas = require('../src/datasource/gravitas')
const authMiddleware = require('./middleware/auth')
const initMiddleware = require('./middleware/init')
const chatMiddleware = require('./middleware/chat')
const endMiddleware = require('./middleware/end')
const debugMiddleware = require('./middleware/debug')

// init http and socketio server
let server
const socketioOpts = { transports: ['xhr-polling', 'polling', 'websocket'] }

// check config whether run over http2
if (commonUtils.getConfigBool(get(config, 'server.overHttp2'))) {
  server = require('http2').createSecureServer({
    allowHTTP1: true,
    key: fs.readFileSync(get(config, 'server.keyPath')),
    cert: fs.readFileSync(get(config, 'server.certPath'))
  }, app)
} else {
  server = require('http').createServer(app)
}

// use custom path '/beanfun' when run on stag or prod env.
// if (get(config, 'server.hostName') !== 'localhost')
socketioOpts.path = '/ws'

const socketio = require('socket.io')(server, socketioOpts)

// replace node native promise implementation
global.Promise = require('bluebird')

// add routing
if (commonUtils.getConfigBool(get(config, 'flags.debugMode'))) {
  app.use('/', express.static(path.join(__dirname, 'public')))
}

// graceful shutdown setting
const gracefulShutdown = (code = 0) => async () => {
  try {
    await redis.disconnect()
    await memcached.disconnect()
    await socketio.close(() => { logger.info('socketio connection closed') })
  } catch (err) {
    logger.error(logUtils.composeFields(logUtils.Constants.FieldError, JSON.stringify(err)), 'Gracefully shutdown failed')
    code = 1
  } finally {
    setTimeout(() => process.exit(code), 500)
  }
}

// unexpected error catching
process
  .on('SIGINT', gracefulShutdown())
  .on('SIGTERM', gracefulShutdown())
  .on('unhandledRejection', err => {
    logger.error(logUtils.composeFields(logUtils.Constants.FieldError, get(err, 'stack')), 'Unhandled rejection')
  })
  .on('uncaughtException', err => {
    logger.error(logUtils.composeFields(logUtils.Constants.FieldError, get(err, 'stack')), 'Uncaught exception')
  })

// init each dependency services
redis.init()
memcached.init()
portiere.init()
gravitas.init()

// setup middleware
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// check health
app.get('/health/heartbeat', (req, res) => {
  res.end()
})

// heap dump
if (commonUtils.getConfigBool(get(config, 'flags.canDumpHeap'))) {
  app.get('/dump', (req, res) => {
    const heapSnapshotStream = v8.getHeapSnapshot()
    const fileName = `${Date.now()}.heapsnapshot`
    const fileStream = fs.createWriteStream(fileName)
    heapSnapshotStream.pipe(fileStream)
    res.status(200).send('OK')
  })
}

// setup socket.io
socketio.adapter(redisAdapter({
  pubClient: redis.getPubAdapter(),
  subClient: redis.getSubAdapter(),
  requestsTimeout: get(config, 'server.socketRequestTimeout')
}))
socketio.of('/').adapter.on('error', () => {
  logger.error('Connect to redis adapter failed')
})
socketio.use(authMiddleware(socketio))
socketio.use(initMiddleware(socketio))
socketio.use(chatMiddleware(socketio))
socketio.use(endMiddleware(socketio))
socketio.use(debugMiddleware(socketio))

// server listening
const port = get(config, 'server.listeningPort')
const host = get(config, 'server.listeningHost')
logger.info(logUtils.composeFields(logUtils.Constants.FieldApplicationUri, host, logUtils.Constants.FieldApplicationPort, port), 'Service Running')
server.listen(port, host)
