import React, { useState } from "react";
import { X, Bell } from "lucide-react";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(true); // Modal tự mở khi render

  const notifications = [
    {
      message: "🎉 Bài đăng của bạn về sản phẩm mới đã được duyệt!",
      time: "2 phút trước",
      isNew: true,
    },
    {
      message: "📅 Bạn đã lên lịch đăng bài thành công cho ngày 15/10.",
      time: "1 giờ trước",
      isNew: false,
    },
    {
      message: "🚀 Hệ thống đã cập nhật tính năng AI tạo nội dung.",
      time: "3 giờ trước",
      isNew: true,
    },
    {
      message: "💡 Gợi ý: Hãy thêm hashtag để tăng độ tương tác bài viết.",
      time: "Hôm qua",
      isNew: false,
    },
    {
      message: "📊 Báo cáo hiệu suất tháng 10 đã sẵn sàng.",
      time: "2 ngày trước",
      isNew: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[450px] max-h-[80vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center gap-2">
            <Bell className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Thông báo</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung thông báo */}
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-3">
          {notifications.map((noti, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border flex items-start gap-3 transition ${
                noti.isNew ? "bg-indigo-50 border-indigo-200" : "bg-white"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  noti.isNew ? "bg-indigo-600" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{noti.message}</p>
                <p className="text-xs text-gray-500 mt-1">{noti.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-3 text-right">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
