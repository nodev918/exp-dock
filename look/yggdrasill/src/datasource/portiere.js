const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')
const { get } = require('lodash')
const config = require('../config')
const logger = require('../logger')
const logUtils = require('../utils/log')

let grpcClient

const init = () => {
  const hosts = get(config, 'connections.grpc.portiere.host')
  const packageDefinition = protoLoader.loadSync(__dirname + '/../../rocks/portiere/authenticator.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
  const packageObject = grpc.loadPackageDefinition(packageDefinition)
  grpcClient = new packageObject.api.Authenticator(hosts, grpc.credentials.createInsecure())

  healthCheck()
    .then(() => logger.info('Connect to portiere succeed'))
    .catch(err => logger.error(logUtils.composeFields(logUtils.Constants.FieldError, JSON.stringify(err)), 'Connect to portiere failed'))
}

const healthCheck = () =>
  new Promise((resolve, reject) => {
    // TODO health check by gRPC
    resolve()
  })

const authenticate = token =>
  new Promise((resolve, reject) => {
    grpcClient.verifyToken({ token }, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

module.exports.init = init
module.exports.authenticate = authenticate
