import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [messageList, setMessageList] = React.useState([]);

  const sendMessage = async () => {
    // 메세지가 보내질 때까지 기다린다.(정확히는 작성된 메시지가 currentMessage에 저장될 때까지 기다린다.)
    if (currentMessage !== "") {
      // 빈 메시지 보내지 않는 조건
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]); // 우리가 보낸 메시지까지 저장
      setCurrentMessage(""); // 우리가 메시지르 보낼 때마다 input을 clear 시킨다.
    }
  };

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      // 내가보낸 메시지를 상대방 화면에 띄운다.
      setMessageList((list) => [...list, data]); // 여기서 list는 현재까지 받은 메세지 리스트를 의미
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          typed="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
