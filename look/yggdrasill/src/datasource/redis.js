const Redis = require('ioredis')
const { get, set, size, each, map, unset } = require('lodash')
const config = require('../config')
const logger = require('../logger')
const logUtils = require('../utils/log')

let generalClient
let observeClient
let socketioPubAdapter
let socketioSubAdapter
const subscribers = {}

const getInstance = () => {
  let client
  const hosts = get(config, 'connections.cache.redis.hosts')
  const options = get(config, 'connections.cache.redis.options')

  if (Array.isArray(hosts)) {
    client = new Redis.Cluster(hosts, options)
      .on('connect', () => logger.info(
        logUtils.composeFields(
          logUtils.Constants.FieldDataSourceUri, map(hosts, host => `${get(host, 'host')}:${get(host, 'port')}`)),
        'Connect to redis succeed'))
      .on('end', () => logger.info(
        logUtils.composeFields(
          logUtils.Constants.FieldDataSourceUri, map(hosts, host => `${get(host, 'host')}:${get(host, 'port')}`)),
        'Connect to redis closed'))
      .on('error', err => logger.error(
        logUtils.composeFields(
          logUtils.Constants.FieldDataSourceUri, JSON.stringify(hosts),
          logUtils.Constants.FieldError, get(err, 'lastNodeError.message')),
        'Connect to redis failed'))
  } else {
    client = new Redis(hosts, options)
      .on('connect', () => logger.info(logUtils.composeFields(logUtils.Constants.FieldDataSourceUri, hosts), 'Connect to redis succeed'))
      .on('end', () => logger.info(logUtils.composeFields(logUtils.Constants.FieldDataSourceUri, hosts), 'Connect to redis closed'))
      .on('error', err => logger.error(
        logUtils.composeFields(
          logUtils.Constants.FieldDataSourceUri, hosts,
          logUtils.Constants.FieldError, get(err, 'lastNodeError.message')),
        'Connect to redis failed'))
  }

  return client
}

const init = () => {
  generalClient = getInstance()
  observeClient = getInstance()
  socketioSubAdapter = getInstance()
  socketioPubAdapter = getInstance()
  observeClient.on('message', (channel, event) => {
    const jsonPayload = JSON.parse(event)
    const path = get(jsonPayload, 'path')
    const payload = Buffer.from(get(jsonPayload, 'payload'), 'base64')
    const filters = get(jsonPayload, 'filters')
    let hasAliveSubscriber = false

    each(subscribers[channel], (subscriber, id) => {
      if (subscriber) {
        const handler = get(subscriber, 'handler')
        handler(path, payload, filters)
        hasAliveSubscriber = true
      }
    })

    // check there is any zombie subscribers
    if (!hasAliveSubscriber) {
      logger.warn(`There is a zombie subscriber: ${channel}`)
      observeClient.unsubscribe(channel)
      unset(subscribers, channel)
    }
  })
}

const getSubAdapter = () => socketioSubAdapter
const getPubAdapter = () => socketioPubAdapter

const disconnect = () => {
  if (generalClient) { generalClient.quit() }
  if (socketioSubAdapter) { socketioSubAdapter.quit() }
  if (socketioPubAdapter) { socketioPubAdapter.quit() }
  if (observeClient) { observeClient.quit() }
}

const publish = (channel, data) => {
  observeClient.publish(channel, data)
}

const subscribe = async (channel, subscriber) =>
  new Promise((resolve, reject) => {
    // if channel subscribers count is empty, subscribe to redis first, then add subscriber
    // otherwise add subscriber directly
    if (size(subscribers[channel]) === 0) {
      observeClient.subscribe(channel, (err, count) => {
        if (!err) {
          set(subscribers, `${channel}.${get(subscriber, 'id')}`, subscriber)
          resolve()
        } else {
          reject(err)
        }
      })
    } else {
      set(subscribers, `${channel}.${get(subscriber, 'id')}`, subscriber)
      resolve()
    }
  })

const unsubscribe = async (channel, subscriber) =>
  new Promise((resolve, reject) => {
    // delete subscriber
    if (subscriber && subscribers[channel] && subscribers[channel][get(subscriber, 'id')]) {
      delete subscribers[channel][get(subscriber, 'id')]
    }

    // if channel subscribers count is empty, unsubscribe to redis
    // otherwise resolve directly
    if (size(subscribers[channel]) === 0) {
      delete subscribers[channel]
      observeClient.unsubscribe(channel, (err, count) => {
        if (!err) {
          resolve()
        } else {
          reject(err)
        }
      })
    } else {
      resolve()
    }
  })

const zrangebyscore = async (zset, min, max, option = {}) =>
  new Promise((resolve, reject) => {
    const params = []
    params.push(zset, min, max)
    if (get(option, 'withscores')) { params.push('withscores') }
    generalClient.zrangebyscore(...params, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const hget = async (hash, field) =>
  new Promise((resolve, reject) => {
    generalClient.hget(hash, field, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const hgetall = async hash =>
  new Promise((resolve, reject) => {
    generalClient.hgetall(hash, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const getKey = async key =>
  new Promise((resolve, reject) => {
    generalClient.get(key, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

module.exports.init = init
module.exports.disconnect = disconnect
module.exports.publish = publish
module.exports.subscribe = subscribe
module.exports.unsubscribe = unsubscribe
module.exports.getSubAdapter = getSubAdapter
module.exports.getPubAdapter = getPubAdapter
module.exports.zrangebyscore = zrangebyscore
module.exports.hgetall = hgetall
module.exports.get = getKey
module.exports.hget = hget
