import React from "react";
import {
  Settings,
  Send,
  Trash2,
  Download,
  Clock,
  Hash,
  BarChart3,
  Lightbulb,
} from "lucide-react";

export default function AIt() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col m-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AI Assistant</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
            <Trash2 size={16} />
            Xóa lịch sử
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
            <Download size={16} />
            Xuất chat
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Chat Section */}
        <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col">
          {/* Header of Assistant */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-xl font-bold">🤖</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Social AI Assistant
                </p>
                <p className="text-green-600 text-sm">Đang hoạt động</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-500">
                <option>GPT-4</option>
                <option>GPT-3.5</option>
              </select>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-600">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-lg font-semibold mb-2">
              Chào bạn! Tôi là AI Assistant
            </h2>
            <p>Tôi có thể giúp bạn:</p>
            <p className="text-gray-500">
              • Tạo nội dung và caption cho bài đăng
            </p>
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi hoặc yêu cầu..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center justify-center">
                <Send size={18} />
              </button>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3 mt-3">
              <button className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100">
                Viết caption
              </button>
              <button className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100">
                Tạo hashtag
              </button>
              <button className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100">
                Lên lịch tối ưu
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-6">
          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold mb-4 text-gray-800">Thao tác nhanh</h3>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium">
                <Clock size={16} /> Tạo caption
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-700 font-medium">
                <Hash size={16} /> Tạo hashtags
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 text-purple-700 font-medium">
                <Clock size={16} /> Tối ưu lịch đăng
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                <BarChart3 size={16} /> Phân tích hiệu suất
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold mb-4 text-gray-800">Gợi ý gần đây</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={16} /> Viết caption
                cho sản phẩm mới
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={16} /> Hashtag
                trending tuần này
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={16} /> Thời gian
                đăng tối ưu
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={16} /> Phân tích
                competitor
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={16} /> Tăng
                engagement rate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
