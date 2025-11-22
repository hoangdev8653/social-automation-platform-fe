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
  MessageSquare, // Icon cho các cuộc hội thoại
  PlusSquare, // Icon cho chat mới
} from "lucide-react";
import { AiConversationStore } from "../../store/ai-conversation";
import { AiMessageStore } from "../../store/ai-message";
import TypingIndicator from "../../components/TypingIndicator";

export default function AI() {
  // --- STATE MỚI ---
  // Lưu tất cả cuộc trò chuyện bằng ID
  const [allConversations, setAllConversations] = useState({});
  // ID của cuộc trò chuyện đang được chọn. "new" là một cuộc trò chuyện mới.
  const [activeConversationId, setActiveConversationId] = useState("new");
  // State để quản lý trạng thái chờ phản hồi từ AI
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const AIConversation = AiConversationStore();
  const AIMessage = AiMessageStore();

  useEffect(() => {
    const fetchData = async () => {
      await AIConversation.getConversationByUser();
    };
    fetchData();
  }, []);

  // Đồng bộ dữ liệu từ API vào state
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

      // --- FIX: KHÔNG auto select conversation cũ
      // Giữ activeConversationId mặc định là "new"
      setActiveConversationId("new");
    }
  }, [AIConversation.data]);

  // --- STATE PHÁI SINH ---
  // Lấy ra danh sách tin nhắn cho cuộc trò chuyện đang được chọn
  const currentMessages = useMemo(() => {
    if (activeConversationId === "new") {
      return []; // Màn hình chào mừng
    }
    return allConversations[activeConversationId]?.messages || [];
  }, [allConversations, activeConversationId]);

  // // Lấy ra danh sách các cuộc hội thoại để render (biến object thành mảng)
  const conversationList = useMemo(() => {
    return Object.values(allConversations).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    ); // mới nhất lên đầu
  }, [allConversations]);

  // --- LOGIC MỚI ---
  const handleSend = async () => {
    if (!input.trim()) return;

    setIsSending(true);
    const userMessage = { role: "user", text: input };
    const currentInput = input;
    setInput(""); // Xóa input ngay lập tức để UX tốt hơn

    // 1. Thêm tin nhắn của người dùng và chỉ báo "đang gõ" vào UI
    const typingIndicator = {
      id: "typing-indicator",
      role: "assistant",
      typing: true,
    };
    const tempMessages = [...currentMessages, userMessage, typingIndicator];

    if (activeConversationId === "new") {
      // Vẫn chưa tạo conversation thật, chỉ hiển thị tạm
      setAllConversations((prev) => ({
        ...prev,
        "new-temp": { messages: tempMessages }, // Bao gồm cả typing indicator
      }));
    } else {
      setAllConversations((prev) => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: tempMessages, // Bao gồm cả typing indicator
        },
      }));
    }

    try {
      // Chuẩn bị payload cho API
      const payload = {
        content: currentInput,
        // Nếu là cuộc hội thoại mới, không truyền conversationId
        ...(activeConversationId !== "new" && {
          conversation_id: activeConversationId,
        }),
      };

      // Gọi API để gửi tin nhắn và nhận phản hồi
      const response = await AIMessage.createMessage(payload); // Giả định hàm này tồn tại
      console.log(response);

      // --- FIX: Lấy dữ liệu từ cấu trúc API đúng ---
      // API trả về { content: {..., conversation_id: '...'} }
      const { content: botMessage } = response.data;
      // --- FIX: Chỉ tạo ID mới khi bắt đầu cuộc hội thoại mới ---
      // Nếu đang trong cuộc hội thoại có sẵn, dùng ID cũ. Nếu không, lấy ID mới từ API.
      console.log(botMessage);

      const conversationIdToUpdate =
        activeConversationId === "new"
          ? botMessage.conversation_id
          : activeConversationId;

      // Cập nhật state với dữ liệu từ API
      setAllConversations((prev) => {
        const newConversations = { ...prev };
        delete newConversations["new-temp"]; // Xóa state tạm nếu có
        const formattedBotMessage = {
          id: botMessage.id, // Sử dụng ID từ API
          text: botMessage.content,
          role: "assistant",
        };

        // Lấy danh sách tin nhắn cũ và thêm tin nhắn mới
        // 2. Thay thế chỉ báo "đang gõ" bằng tin nhắn thật của bot
        const messagesWithoutTyping = tempMessages.filter((m) => !m.typing);
        const finalMessages = [...messagesWithoutTyping, formattedBotMessage];

        // Cập nhật hoặc tạo mới cuộc hội thoại
        newConversations[conversationIdToUpdate] = {
          ...prev[conversationIdToUpdate], // Giữ lại thông tin cũ nếu có
          id: conversationIdToUpdate,
          title:
            prev[conversationIdToUpdate]?.title ||
            currentInput.substring(0, 40), // Tạo title mới nếu chưa có
          messages: finalMessages,
        };
        return newConversations;
      });

      // Chuyển sang conversation (mới hoặc cũ)
      setActiveConversationId(conversationIdToUpdate);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      // Có thể thêm logic xử lý lỗi ở đây, ví dụ: hiển thị lại input
      setInput(currentInput);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Thêm !e.shiftKey để cho phép xuống dòng
      e.preventDefault(); // Ngăn xuống dòng khi Enter
      handleSend();
    }
  };

  // Hàm chọn một cuộc trò chuyện
  const selectConversation = async (id) => {
    // Chỉ fetch dữ liệu nếu cuộc hội thoại chưa có tin nhắn
    const conversation = allConversations[id];
    if (
      id !== "new" &&
      (!conversation?.messages || conversation.messages.length === 0)
    ) {
      const response = await AIMessage.getMessageByConversation(id);
      const messagesFromApi = response?.data?.content;

      if (messagesFromApi && messagesFromApi.length > 0) {
        // Chuyển đổi dữ liệu từ API để khớp với cấu trúc của component
        // API dùng: { content: "...", role: "user" | "model" }
        // Component dùng: { text: "...", role: "user" | "assistant" }
        const formattedMessages = messagesFromApi.map((msg) => ({
          id: msg.id, // Thêm ID cho tin nhắn để làm key
          text: msg.content,
          role: msg.role === "model" ? "assistant" : "user",
        }));

        // Cập nhật state với tin nhắn đã được fetch
        setAllConversations((prev) => ({
          ...prev,
          [id]: { ...prev[id], messages: formattedMessages },
        }));
      }
    }

    setActiveConversationId(id);
  };

  // Hàm bắt đầu chat mới
  const startNewChat = () => {
    setActiveConversationId("new");
    setInput(""); // Xóa input khi chat mới
  };

  // Hàm xóa cuộc trò chuyện HIỆN TẠI
  const handleClearActiveChat = async () => {
    if (activeConversationId === "new") {
      return; // Không có gì để xóa
    }
    await AIConversation.deleteConversation(activeConversationId);

    // Xóa khỏi state
    setAllConversations((prev) => {
      const newState = { ...prev };
      delete newState[activeConversationId];
      return newState;
    });

    // Quay về màn hình chat mới
    startNewChat();
  };

  // Tự động cuộn xuống cuối
  useEffect(() => {
    const chatBody = document.getElementById("chat-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [currentMessages]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-16 px-6 mt-6">
        <h1 className="text-3xl font-bold text-gray-800">AI Assistant</h1>
        <div className="flex gap-3">
          {/* NÚT ĐÃ CẬP NHẬT */}
          <button
            onClick={handleClearActiveChat}
            disabled={activeConversationId === "new"} // Vô hiệu hóa nếu là chat mới
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            Xóa cuộc trò chuyện
          </button>
        </div>
      </div>

      {/* Vùng Content */}
      <div className="flex gap-6 flex-1 min-h-0 px-6 pb-6">
        {/* Chat Section */}
        <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            {/* ... (Nội dung header không đổi) ... */}
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-xl font-bold">🤖</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {activeConversationId === "new"
                    ? "Social AI Assistant"
                    : allConversations[activeConversationId]?.title}
                </p>
                <p className="text-green-600 text-sm">Đang hoạt động</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>Google Gemini</option>
              </select>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {/* ID được thêm vào để auto-scroll */}
          <div
            id="chat-body"
            className="flex-1 p-6 space-y-4 overflow-y-auto min-h-0"
          >
            {/* CẬP NHẬT: Kiểm tra currentMessages */}
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-gray-600 h-full">
                <div className="text-4xl mb-4">🤖</div>
                <h2 className="text-lg font-semibold mb-2">
                  Chào bạn! Tôi là AI Assistant
                </h2>
                <p>Tôi có thể giúp bạn:</p>
                <p className="text-gray-500">
                  • Tạo nội dung và caption cho bài đăng
                </p>
              </div>
            )}

            {/* CẬP NHẬT: Map qua currentMessages */}
            {currentMessages.map((msg, index) =>
              // Nếu là tin nhắn đang gõ, render component TypingIndicator
              msg.typing ? (
                <TypingIndicator key={msg.id} />
              ) : (
                <div
                  key={msg.id || `msg-${index}`} // --- FIX: Sử dụng ID của tin nhắn làm key
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-xl max-w-[70%] ${
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

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi hoặc yêu cầu (Shift + Enter để xuống dòng)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending} // Vô hiệu hóa khi đang gửi
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()} // Vô hiệu hóa khi đang gửi hoặc input rỗng
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            {/* ... (quick actions) ... */}
          </div>
        </div>

        {/* Sidebar */}
        {/* THÊM overflow-y-auto vào đây */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto">
          {/* ===================================== */}
          {/* ⭐ THẺ MỚI: HỘI THOẠI GẦN ĐÂY ⭐ */}
          {/* ===================================== */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold mb-4 text-gray-800">
              Hội thoại gần đây
            </h3>
            <div className="flex flex-col gap-2">
              {/* Nút Chat Mới */}
              <button
                onClick={startNewChat}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-left cursor-pointer
                  ${
                    activeConversationId === "new"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                <PlusSquare size={16} /> Bắt đầu cuộc trò chuyện mới
              </button>

              <hr className="my-2" />

              {/* Danh sách các cuộc trò chuyện cũ */}
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                {conversationList.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Chưa có hội thoại nào.
                  </p>
                )}

                {conversationList.map((convo) => (
                  <div
                    key={convo.id}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm truncate cursor-pointer
                      ${
                        activeConversationId === convo.id
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }
                    `}
                    onClick={() => selectConversation(convo.id)}
                  >
                    <MessageSquare size={16} className="flex-shrink-0" />
                    <span className="truncate cursor-pointer">
                      {convo.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thẻ Thao Tác Nhanh */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold mb-4 text-gray-800">Thao tác nhanh</h3>
            <div className="flex flex-col gap-3">
              {/* ... (nội dung không đổi) ... */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium">
                <Clock size={16} /> Tạo caption
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-700 font-medium">
                <Hash size={16} /> Tạo hashtags
              </button>
              {/* ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
