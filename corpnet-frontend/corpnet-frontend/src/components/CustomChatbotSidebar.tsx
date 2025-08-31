import { useState, FormEvent } from "react";
import axios from "axios";

const CustomChatbotSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    console.log("[CustomChatbotSidebar.tsx] message=>", message);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/chat`,
        { message: message },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("[CustomChatbotSidebar.tsx] response =>", response.data);

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
      console.error("[CustomChatbotSidebar.tsx] Error:", err);

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Server error" },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-screen bg-white shadow-lg border-l border-gray-300
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "-translate-y-full"}
          z-50 flex flex-col
        `}
        style={{ top: 0, right: 0 }}
      >
        {/* Chat content */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-white">
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

        {/* Input area */}
        <form
          onSubmit={sendMessage}
          className="flex p-4 border-t border-gray-300 gap-3"
        >
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

      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-2 right-4 z-60 bg-teal-500 text-white p-3 rounded-md shadow-md
          hover:bg-teal-600 transition-colors duration-200
          ${isOpen ? "rotate-45" : "rotate-0"}
        `}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        style={{ zIndex: 60 }}
      >
        {isOpen ? "×" : "☰"}
      </button>
    </>
  );
};

export default CustomChatbotSidebar;
