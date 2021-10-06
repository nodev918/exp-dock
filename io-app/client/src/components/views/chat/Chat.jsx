import React from "react";
import "./chat.css";
import { io } from "socket.io-client";
import { NameContext } from "../../../App";

export default function Chat() {
  const [socket, setSocket] = React.useState();
  const [messageArr, setMessagearr] = React.useState([]);
  const [temp, setTemp] = React.useState();
  const mockNames = React.useContext(NameContext);
  const [randname, setRandname] = React.useState();

  function addMessage(message) {
    const newList = messageArr.concat(message);
    setMessagearr(newList);
    console.log("newList: ", newList);
    //console.log(messageArr);
  }

  React.useEffect(() => {
    const s = io();
    setSocket(s);
    setRandname(mockNames[Math.floor(Math.random() * mockNames.length)]);
  }, []);

  React.useEffect(() => {
    console.log("妳/你的亂數名稱是: ", randname);
  }, [randname]);

  React.useEffect(() => {
    if (socket == null) return;
    socket.on("channel1", (arg) => {
      setTemp(arg);
    });
  }, socket);

  React.useEffect(() => {
    if (temp == undefined) return;
    addMessage(temp);
  }, [temp]);

  function emitMessage(channel, message) {
    socket.emit(channel, message);
  }

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-box">
          {messageArr.map((item) => {
            return (
              <>
                <div>{`${item.name}:  ${item.message}`}</div>
              </>
            );
          })}
        </div>

        <div className="input-box">
          <input
            type="text"
            className="input"
            placeholder="text"
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                emitMessage("channel1", {name:randname,message:e.target.value});
                e.target.value = "";
              }
            }}
          />

        </div>
      </div>
    </div>
  );
}
