import io from "socket.io-client";

const URL = "https://stg-socket.beanfun.com:3001";
const socket = io(URL, { autoConnect: false, path: '/ws', transports: ['websocket'] });

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });
//
socket.connect();
export default socket;

/*
domain: stg-socket.beanfun.com
path: /ws
port: 3001
*/