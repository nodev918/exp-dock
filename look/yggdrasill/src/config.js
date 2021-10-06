module.exports = {
  server: {
    hostName: process.env.HOST_NAME || 'localhost',
    listeningHost: process.env.LISTENING_HOST || 'localhost',
    listeningPort: process.env.LISTENING_PORT || '3001',
    loginTimeout: process.env.LOGIN_TIMEOUT || '30000',
    snapshotInterval: process.env.SNAPSHOT_INTERVAL || '2000',
    authenticateInterval: process.env.AUTHENTICATE_INTERVAL || '30000',
    socketRequestTimeout: process.env.SOCKET_REQUEST_TIMEOUT || '3000',
    overHttp2: process.env.OVER_HTTP2 || false,
    certPath: process.env.CERT_PATH || 'beanfun.com.pem',
    keyPath: process.env.KEY_PATH || 'beanfun.com.key',
    snapshotForceRefreshedTime: process.env.SNAPSHOT_FORCE_REFRESHED_TIME || '0'
  },
  connections: {
    cache: {
      redis: {
        hosts: [
          {
            port: process.env.REDIS_PORT || '7000',
            host: process.env.REDIS_HOST || 'localhost'
          }
        ],
        options: {
          enableReadyCheck: true,
          redisOptions: {
            password: process.env.REDIS_PASSWORD || ''
          }
        }
      },
      memcached: {
        host: process.env.MEMCACHED_HOST || 'localhost:11211'
      }
    },
    grpc: {
      portiere: {
        host: process.env.PORTIERE_HOST || 'localhost:8888'
      },
      gravitas: {
        host: process.env.GRAVITAS_HOST || 'localhost:8888'
      }
    }
  },
  logs: {
    level: process.env.LOGS_LEVEL || 'debug',
    determinedIndices: process.env.LOGS_INDICES || 'user_id,thread_id,err_code,request_id,source,api,grpc_status,http_status,http_method,elapsed_time,user_agent'
  },
  flags: {
    getSnapshotFromCache: process.env.FLAGS_GET_SNAPSHOT_FROM_CACHE || false,
    alwaysGetSnapshot: process.env.FLAGS_ALWAYS_GET_SNAPSHOT || false,
    serviceUnavailable: process.env.FLAGS_SERVICE_UNAVAILABLE || false,
    unavailableHint: process.env.FLAGS_UNAVAILABLE_HINT || '',
    debugMode: process.env.FLAGS_DEBUG_MODE || false,
    doNotHandleEvent: process.env.FLAGS_DO_NOT_HANDLE_EVENT || false,
    doNotEmitEvent: process.env.FLAGS_DO_NOT_EMIT_EVENT || false,
    canDumpHeap: process.env.FLAGS_CAN_DUMP_HEAP || false
  },
  // 新開發的功能透過此處的 Flag 決定是否開啟，待正式上版後便可以移除。因與原本 flags 用途不一致所以切開來放
  featureFlags: {
    enableBystander: process.env.FEATURE_FLAGS_ENABLE_BYSTANDER || false,
  }
}
