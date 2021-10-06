const { isEmpty } = require('lodash')

const transformRequest = data => {
  if (Array.isArray(data) && !isEmpty(data)) { return JSON.parse(data[0]) } else if (typeof data === 'string') { return JSON.parse(data) }
  return data
}

const executeCallback = (callback, payload) => {
  if (typeof callback === 'function') { callback(payload) }
}

const getConfigBool = val => val && val !== 'false'

module.exports.transformRequest = transformRequest
module.exports.executeCallback = executeCallback
module.exports.getConfigBool = getConfigBool
