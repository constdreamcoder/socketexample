const express = require("express");
const app = express();
const http = require("http"); // node.js에 내장된 http 라이브러리를 불러옴(saeme as the import in React)
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors()); // CORS 관련 문제해결 미들웨어 사용

const server = http.createServer(app); // server 생성(generate a server)

const io = new Server(server, {
  // express 서버와 socket.io 연동
  cors: {
    origin: "http://localhost:3000", // 연동된 socket.io 서버에 돌릴 주소 혹은 서버
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // 특정한 이벤트(리덕스의 type과 비슷한 개념)을 admit, detect, listen하여 구동한다.
  console.log(`User Connected: ${socket.id}`); // 유저가 socket 서버에 접속할 때마다 특별한 id가 부여된다.

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    console.log(data.room);
    socket.to(data.room).emit("receive_message", data); // 송신자에게 받은 메시지를 다시 보낸다. '.to(data.room)' 은 같은 채팅방에 있는 사람에게 메시지 보내기
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
