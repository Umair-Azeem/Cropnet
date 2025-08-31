import { useState, FormEvent, useEffect } from "react";
import axios from "axios";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ChatbotPOC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    console.log("[ChatbotPOC.tsx] message=>", message);

    try {
 const response = await axios.post(
      `http://localhost:5000/api/chat`, 
      { message: message },
      { headers: { "Content-Type": "application/json" } }
    );
      console.log("[ChatbotPOC.tsx] response =>", response.data);

      if (response.data.success) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: response.data.reply },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Error: " + response.data.reply },
        ]);
      }
    } catch (err) {
        console.error("[ChatbotPOC.tsx] Error:", err);

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Server error" },
      ]);
    }

    setMessage("");
    setLoading(false);
  };


    // const sendMessage = async () => {
    //   try {
    //     const response = await axios.post(
    //   `http://192.168.18.28:5000/api/chat`, 
    //   { message: "tell me about weather?" },
    //   { headers: { "Content-Type": "application/json" } }
    // );
    //     console.log("[ChatbotPOC.tsx] response =>", response.data);
    //   } catch (err) {
    //     console.error("[ChatbotPOC.tsx] Error:", err);
    //   }
    // };

    // useEffect(() => {
    //   sendMessage();
    // }, []);

  return (
    <div className="max-w-xl mx-auto p-6 font-sans flex flex-col h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">💬 Chat with AI</h1>

      <div className="flex-1 overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-4">
        {chatHistory.map((chat, i) => (
          <div
            key={i}
            className={`max-w-3/4 px-4 py-2 rounded-xl break-words ${
              chat.role === "user"
                ? "bg-green-200 self-end text-gray-900"
                : "bg-gray-100 self-start text-gray-800"
            }`}
          >
            <span className="font-semibold">
              {chat.role === "user" ? "You: " : "Bot: "}
            </span>
            {chat.content}
          </div>
        ))}
        {loading && (
          <p className="text-gray-500 italic select-none">Bot is typing...</p>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex mt-4 gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 text-white rounded-lg px-6 py-2 font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatbotPOC;
