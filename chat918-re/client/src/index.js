import "./index.css";
const io = require("socket.io-client");

const socket = io();

var UserName = "";

//var Url = 'http://stg-socket.beanfun.com:3001/ws'
const inp = document.getElementById("input");
const nam = document.getElementById("name");

var Pb = document.getElementById("pb-render");
const pbButton = document.querySelector(".pb-button");
var WS = document.getElementById("ws-render");
const wsButton = document.querySelector(".ws-button");

function fetchServer() {
  console.log("in fetchServer");
  fetch(Url)
    .then((res) => res.json)
    .then((data) => {
      console.log(data);
    });
}

if ("WebSocket" in window) {
  //console.log("websocket checked!")
  //var ws = new WebSocket("ws://stg-socket.beanfun.com:3001/ws");

  var ws = new WebSocket("ws://localhost:8001");
  ws.open = function () {
    console.log("[client.ws]: open checked");
  };
  ws.onmessage = function (evt) {
    //console.log("[client.ws]: onmessage checked")
    var received_msg = evt.data;
    console.log(`[ws]message> ${received_msg}`);
  };

  ws.onclose = function () {
    // 关闭 websocket
    //alert("连接已关闭...");
  };
}

socket.on("connect", () => {
  console.log(`[io]sys: connect`);
});

socket.on("message", (msg) => {
  console.log(`[io]message> ${msg}`);
  renderMsg(msg);
});

/*    current working     */
socket.on("pb", (msg) => {
  print(`[io]message> ${msg}`, Pb);
});
pbButton.onclick = function (e) {
  console.log("in pbButton");
  socket.emit("pb", "test pbButton");
};

/*    current working     */

inp.onkeydown = function (e) {
  if (e.keyCode == 13) {
    const msg = e.target.value;
    e.preventDefault();
    socket.emit("message", `${UserName}說:　${msg}`);
    e.target.value = "";
    //renderMsg(UserName, msg)
  }
};
nam.onkeydown = function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    UserName = e.target.value;
    console.log(`[io client]user set name: ${UserName}`);
    e.target.value = UserName;
    e.target.setAttribute("disabled", "");
    initName(UserName, " 名字設定完成!");
  }
};
wsButton.onclick = function (e) {
  print("ws-button test", WS);
  //fetchServer()
};

function disableNameBox(item) {
  item;
}
function initName(name, data) {
  const messageBox = document.querySelector("#messages");
  const msg = document.createElement("div");
  msg.innerText = `${name}:　${data}`;
  messageBox.appendChild(msg);
}
function renderMsg(data) {
  const messageBox = document.querySelector("#messages");
  const msg = document.createElement("div");
  msg.innerText = `${data}`;
  messageBox.appendChild(msg);
}
function print(msg, target) {
  target.append(msg);
  target.append(document.createElement("br"));
}

/*
import data from './img/1.jpg'
import {Navbar} from './components/Navbar'
console.log("hello world")
const img = new Image()
img.src = data
img.style.width='300px'
img.style.height='300px'
const ele = document.body.append(img)
Navbar(document.body)
*/
