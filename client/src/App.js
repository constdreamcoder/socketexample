import "./App.css";
import io from "socket.io-client";
import React, { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001"); // socket.io 서버 측을 클라이언트 측과 연결

function App() {
  const [username, setUsername] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [showChat, setShowChat] = React.useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
