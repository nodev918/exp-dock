const { get, size, includes } = require('lodash')
const config = require('../config')
const indices = get(config, 'logs.indices')

const composeFields = (...fields) => {
  const result = {}
  const metadata = {}

  if (size(fields) % 2 !== 0) {
    return null
  }

  for (let i = 0; i < size(fields); i += 2) {
    if (includes(indices, fields[i])) {
      result[fields[i]] = fields[i + 1]
    } else {
      metadata[fields[i]] = fields[i + 1]
    }
  }

  result.metadata = JSON.stringify(metadata)
  return result
}

const Constants = {
  // indices
  FieldUserID: 'user_id',
  FieldAliasID: 'alias_id',
  FieldGRPCStatus: 'grpc_status',
  FieldHTTPStatus: 'http_status',
  FieldHTTPMethod: 'http_method',
  FieldElapsedTime: 'elapsed_time',
  FieldAPI: 'api',

  // metadata
  FieldError: 'err',
  FieldStack: 'stack',
  FieldErrorCode: 'err_code',
  FieldErrorID: 'err_id',
  FieldOpenID: 'open_id',
  FieldApplicationUri: 'application_uri',
  FieldApplicationPort: 'application_port',
  FieldStackTrace: 'stacktrace',
  FieldGRPCCommand: 'grpc_command',
  FieldGRPCResult: 'grpc_result',
  FieldPhone: 'phone',
  FieldSMS: 'sms',
  FieldEmail: 'email',
  FieldQRCode: 'qrcode',
  FieldCountryCode: 'country_code',
  FieldHTTPHeader: 'http_header',
  FieldHTTPResponse: 'http_resp',
  FieldHTTPRequest: 'http_req',
  FieldWSRequest: 'ws_req',
  FieldDataSourceUri: 'data_source_uri',
  FieldDataSourceUser: 'data_source_user',
  FieldDataSourceHost: 'data_source_host',
  FieldDataSourceName: 'data_source_name',
  FieldDataSourceMaxOpen: 'data_source_max_open',
  FieldDataSourceMaxIdle: 'data_source_max_idle',
  FieldData: 'data',
  FieldToken: 'token',
  FieldChatID: 'chat_id',
  FieldMessageID: 'message_id',
  FieldCmdID: 'cmd_id',
  FieldRoomID: 'room_id',
  FieldServiceID: 'svc_id',
  FieldPartition: 'partition',
  FieldOffset: 'offset',
  FieldUserAgent: 'user_agent',
  FieldDevice: 'device',
  FieldSessionID: 'sid',
  FieldReason: 'reason',
  FieldPath: 'path'
}

module.exports.composeFields = composeFields
module.exports.Constants = Constants
