module.exports = () => {
    console.log("in callws")
    const WebSocket = require('ws');
    const ws = new WebSocket('ws://localhost:8000')

    //const ws = new WebSocket('ws://stg-socket.beanfun.com:3001');
    ws.on('open', function open() {
        console.log("websocket open")
        //ws.send(msgBuffer);
    });

    ws.on('echo', function echo() {
        console.log("websocket echo")
        ws.send('echo from server');
    });

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('error', (error) => {
        console.log("the error is: ", error)
    })
    /********  websocket **********/



}
 /********  websocket **********/
