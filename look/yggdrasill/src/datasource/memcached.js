const Memcached = require('memcached')
const { get } = require('lodash')
const config = require('../config')
const logger = require('../logger')
const logUtils = require('../utils/log')

let client

const getInstance = () => {
  const hostsStr = get(config, 'connections.cache.memcached.host')
  const hostsArr = hostsStr.split(',')

  client = new Memcached(hostsArr)
  client.set('health-check', 1, 10,
    err => err
      ? logger.error(logUtils.composeFields(logUtils.Constants.FieldError, JSON.stringify(err)), 'Connect to memcached failed')
      : logger.info('Connect to memcached succeed'))

  return client
}

const init = () => { client = getInstance() }

const getCache = async (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

const setCache = async (key, value, ttl) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, ttl, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

const incrCache = async (key, value) => {
  return new Promise((resolve, reject) => {
    client.incr(key, value, err => {
      if (!err) {
        resolve()
      } else {
        reject(err)
      }
    })
  })
}

const decrCache = async (key, value) => {
  return new Promise((resolve, reject) => {
    client.decr(key, value, err => {
      if (!err) {
        resolve()
      } else {
        reject(err)
      }
    })
  })
}

const disconnect = () => { client.end() }

module.exports.init = init
module.exports.disconnect = disconnect
module.exports.getCache = getCache
module.exports.setCache = setCache
module.exports.incrCache = incrCache
module.exports.decrCache = decrCache