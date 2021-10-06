const pino = require('pino')
const { get } = require('lodash')
const config = require('./config')
const logger = pino({
  base: {
    hostname: get(config, 'server.hostName')
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  useLevelLabels: true,
  level: get(config, 'logs.level')
},

pino.destination()
).child({
  service: 'yggdrasill',
  logger: 'default'
})

module.exports = logger
