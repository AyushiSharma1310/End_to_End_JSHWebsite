import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_CHATBOT_API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });


      const data = await res.json();

      setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error connecting to server" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "450px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px",
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            🤖 BharatWIN AI ▼
          </div>

          {/* Chat area */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {chat.map((c, i) => (
              <div
                key={i}
                style={{
                  textAlign: c.role === "user" ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: c.role === "user" ? "#2563eb" : "#e5e7eb",
                    color: c.role === "user" ? "white" : "black",
                    maxWidth: "80%",
                    textAlign: "left",
                    whiteSpace: "pre-wrap",   // ⭐ IMPORTANT
                    lineHeight: "1.5"
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p style={{ margin: "6px 0" }}>{children}</p>,
                      li: ({ children }) => <li style={{ marginLeft: "16px" }}>{children}</li>,
                    }}>
                    {c.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ fontSize: "12px", color: "gray" }}>
                Bot is typing...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "8px", gap: "5px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "8px 12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;