import React, { useState, useMemo, useEffect } from "react";
import {
  Settings,
  Send,
  Trash2,
  Download,
  Clock,
  Hash,
  BarChart3,
  Lightbulb,
  MessageSquare,
  PlusSquare,
  Menu, // Thêm icon Menu
  X, // Thêm icon X
} from "lucide-react";
import { AiConversationStore } from "../../store/ai-conversation";
import { AiMessageStore } from "../../store/ai-message";
import TypingIndicator from "../../components/TypingIndicator";

export default function AI() {
  // --- STATE CŨ ---
  const [allConversations, setAllConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState("new");
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const AIConversation = AiConversationStore();
  const AIMessage = AiMessageStore();

  // --- STATE MỚI CHO RESPONSIVE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Quản lý sidebar mobile

  useEffect(() => {
    const fetchData = async () => {
      await AIConversation.getConversationByUser();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (AIConversation.data?.content) {
      const conversationsFromApi = AIConversation.data.content.reduce(
        (acc, convo) => {
          acc[convo.id] = { ...convo, messages: convo.messages || [] };
          return acc;
        },
        {}
      );
      setAllConversations(conversationsFromApi);
      setActiveConversationId("new");
    }
  }, [AIConversation.data]);

  const currentMessages = useMemo(() => {
    if (activeConversationId === "new") {
      return [];
    }
    return allConversations[activeConversationId]?.messages || [];
  }, [allConversations, activeConversationId]);

  const conversationList = useMemo(() => {
    return Object.values(allConversations).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [allConversations]);

  // --- LOGIC GỬI TIN NHẮN (GIỮ NGUYÊN) ---
  const handleSend = async () => {
    if (!input.trim()) return;

    setIsSending(true);
    const userMessage = { role: "user", text: input };
    const currentInput = input;
    setInput("");

    const typingIndicator = {
      id: "typing-indicator",
      role: "assistant",
      typing: true,
    };
    const tempMessages = [...currentMessages, userMessage, typingIndicator];

    if (activeConversationId === "new") {
      setAllConversations((prev) => ({
        ...prev,
        "new-temp": { messages: tempMessages },
      }));
    } else {
      setAllConversations((prev) => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: tempMessages,
        },
      }));
    }

    try {
      const payload = {
        content: currentInput,
        ...(activeConversationId !== "new" && {
          conversation_id: activeConversationId,
        }),
      };

      const response = await AIMessage.createMessage(payload);
      const { content: botMessage } = response.data;

      const conversationIdToUpdate =
        activeConversationId === "new"
          ? botMessage.conversation_id
          : activeConversationId;

      setAllConversations((prev) => {
        const newConversations = { ...prev };
        delete newConversations["new-temp"];
        const formattedBotMessage = {
          id: botMessage.id,
          text: botMessage.content,
          role: "assistant",
        };

        const messagesWithoutTyping = tempMessages.filter((m) => !m.typing);
        const finalMessages = [...messagesWithoutTyping, formattedBotMessage];

        newConversations[conversationIdToUpdate] = {
          ...prev[conversationIdToUpdate],
          id: conversationIdToUpdate,
          title:
            prev[conversationIdToUpdate]?.title ||
            currentInput.substring(0, 40),
          messages: finalMessages,
        };
        return newConversations;
      });

      setActiveConversationId(conversationIdToUpdate);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setInput(currentInput);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConversation = async (id) => {
    const conversation = allConversations[id];
    if (
      id !== "new" &&
      (!conversation?.messages || conversation.messages.length === 0)
    ) {
      const response = await AIMessage.getMessageByConversation(id);
      const messagesFromApi = response?.data?.content;

      if (messagesFromApi && messagesFromApi.length > 0) {
        const formattedMessages = messagesFromApi.map((msg) => ({
          id: msg.id,
          text: msg.content,
          role: msg.role === "model" ? "assistant" : "user",
        }));

        setAllConversations((prev) => ({
          ...prev,
          [id]: { ...prev[id], messages: formattedMessages },
        }));
      }
    }

    setActiveConversationId(id);
    setIsSidebarOpen(false); // Đóng sidebar sau khi chọn trên mobile
  };

  const startNewChat = () => {
    setActiveConversationId("new");
    setInput("");
    setIsSidebarOpen(false); // Đóng sidebar sau khi chọn
  };

  const handleClearActiveChat = async () => {
    if (activeConversationId === "new") return;
    await AIConversation.deleteConversation(activeConversationId);

    setAllConversations((prev) => {
      const newState = { ...prev };
      delete newState[activeConversationId];
      return newState;
    });
    startNewChat();
  };

  useEffect(() => {
    const chatBody = document.getElementById("chat-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [currentMessages]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-4 pt-4 px-4 sm:pt-16 sm:px-6 sm:mt-6 shrink-0">
        <div className="flex items-center gap-3">
          {/* Nút Hamburger cho Mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            AI Assistant
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClearActiveChat}
            disabled={activeConversationId === "new"}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Xóa cuộc trò chuyện</span>
            <span className="sm:hidden">Xóa</span>
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-1 min-h-0 px-2 pb-2 sm:px-6 sm:pb-6 gap-6 relative">
        {/* 1. CHAT SECTION (Main Content) */}
        <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col w-full min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-full shrink-0">
                <span className="text-purple-600 text-lg sm:text-xl font-bold">
                  🤖
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {activeConversationId === "new"
                    ? "Social AI Assistant"
                    : allConversations[activeConversationId]?.title}
                </p>
                <p className="text-green-600 text-xs sm:text-sm">
                  Đang hoạt động
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select className="hidden sm:block border border-gray-300 rounded-lg px-3 py-1 text-sm max-w-[120px]">
                <option>Google Gemini</option>
              </select>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div
            id="chat-body"
            className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0"
          >
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-gray-600 h-full px-4">
                <div className="text-4xl mb-4">🤖</div>
                <h2 className="text-lg font-semibold mb-2">
                  Chào bạn! Tôi là AI Assistant
                </h2>
                <p className="text-sm sm:text-base">Tôi có thể giúp bạn:</p>
                <p className="text-gray-500 text-sm sm:text-base">
                  • Tạo nội dung và caption cho bài đăng
                </p>
              </div>
            )}

            {currentMessages.map((msg, index) =>
              msg.typing ? (
                <TypingIndicator key={msg.id} />
              ) : (
                <div
                  key={msg.id || `msg-${index}`}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl max-w-[85%] sm:max-w-[70%] text-sm sm:text-base break-words ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập yêu cầu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-sm sm:text-base"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. OVERLAY BACKDROP (Chỉ hiện trên mobile khi mở menu) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* 3. SIDEBAR SECTION */}
        <div
          className={`
            fixed top-0 right-0 h-full w-[280px] bg-gray-50 z-50 shadow-2xl transition-transform duration-300 ease-in-out
            lg:static lg:h-auto lg:w-80 lg:shadow-none lg:translate-x-0 lg:bg-transparent lg:flex lg:flex-col lg:gap-6 lg:overflow-y-auto
            ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Mobile Header cho Sidebar (Nút đóng) */}
          <div className="flex justify-between items-center p-4 lg:hidden border-b bg-white">
            <h3 className="font-bold text-lg text-gray-800">Menu</h3>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="flex flex-col gap-4 p-4 lg:p-0 lg:gap-6 h-full overflow-y-auto">
            {/* THẺ: HỘI THOẠI GẦN ĐÂY */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 shrink-0">
              <h3 className="font-semibold mb-4 text-gray-800">
                Hội thoại gần đây
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={startNewChat}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-left cursor-pointer transition
                    ${
                      activeConversationId === "new"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <PlusSquare size={16} />
                  <span className="text-sm">Bắt đầu chat mới</span>
                </button>

                <hr className="my-2" />

                <div className="max-h-[200px] lg:max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {conversationList.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      Chưa có hội thoại nào.
                    </p>
                  )}

                  {conversationList.map((convo) => (
                    <div
                      key={convo.id}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm truncate cursor-pointer transition
                        ${
                          activeConversationId === convo.id
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }
                      `}
                      onClick={() => selectConversation(convo.id)}
                    >
                      <MessageSquare size={16} className="flex-shrink-0" />
                      <span className="truncate">{convo.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* THẺ: THAO TÁC NHANH */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 shrink-0">
              <h3 className="font-semibold mb-4 text-gray-800">
                Thao tác nhanh
              </h3>
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium text-sm transition">
                  <Clock size={16} /> Tạo caption
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-700 font-medium text-sm transition">
                  <Hash size={16} /> Tạo hashtags
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
