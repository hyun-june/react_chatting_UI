import { useEffect, useRef, useState } from "react";
import "./App.css";
import FileContent from "./components/FileContent/FileContent";

function App() {
  const [messages, setMessages] = useState([
    { sender: "other", text: "안녕하세요!" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [fileList, setFileList] = useState([{ sender: "other", name: "pdf" }]);
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);
  const objectURLs = useRef([]);

  useEffect(() => {
    return () => {
      objectURLs.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === "" && !newFile) return;

    if (newMessage.trim()) {
      const userMessage = { sender: "user", text: newMessage };
      setMessages([...messages, userMessage]);
    }

    if (newFile) {
      const fileURL = URL.createObjectURL(newFile);
      objectURLs.current.push(fileURL);
      const userFile = {
        sender: "user",
        text: newFile.name,
        file: fileURL,
        type: "file",
        fileType: newFile.type,
      };

      setMessages((prev) => [...prev, userFile]);
      setFileList((prev) => [...prev, userFile]);
      setNewFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setNewMessage("");
  };

  const enterMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }

    if (e.key === "Backspace" && newFile) {
      setNewFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  console.log("메세지", messages);
  console.log("파일", fileList);

  return (
    <div className="chat">
      <div className="message_section">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "user" ? "user" : "other"
            }`}
          >
            {message.type === "file" ? (
              <FileContent message={message} />
            ) : (
              <p>
                {message.text?.split("\n").map((textLine, i) => (
                  <span key={i}>
                    {textLine}
                    <br />
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="send_message">
        <input
          type="file"
          id="file"
          onChange={(e) => uploadFile(e)}
          ref={fileInputRef}
        />
        <label htmlFor="file">➕</label>

        <textarea
          placeholder="메세지를 입력해주세요."
          value={newFile ? `${newFile.name}` : newMessage}
          onChange={(e) => {
            if (!newFile) {
              setNewMessage(e.target.value);
            }
          }}
          onKeyDown={(e) => enterMessage(e)}
        />

        <button onClick={sendMessage}>🔺</button>
      </div>
    </div>
  );
}

export default App;
