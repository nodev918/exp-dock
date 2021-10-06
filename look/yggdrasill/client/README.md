# GUI client with Socket.IO

Reference:

- [private-messaging](https://github.com/socketio/socket.io/tree/master/examples/private-messaging)
- [how-to-use-protobuf-in-vue](https://segmentfault.com/a/1190000021052292)

## Running the frontend

```
npm install
npm run serve
```

## Bundle proto to static javascript

1. Use npx command to bundle proto files
```
npx pbjs -t json-module -w commonjs --force-long -o src/proto/proto.js ../rocks/chat/proto/chatEntities.proto ../rocks/chat/proto/socketEntities.proto
```

2. Add `long` util to proto.js like the following code snippet, otherwise the accuracy of int64 will be lost 
```
var $protobuf = require("protobufjs/light");
$protobuf.util.Long = require('long');

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
...
```