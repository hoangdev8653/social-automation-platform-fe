import { useEffect, useState, useRef } from "react";
import { X, Bell } from "lucide-react";
import { notificationStore } from "../store/notification";
import { formatTimeAgo } from "../utils/formatTimeAgo";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const notification = notificationStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      await notification.getNotificationByUser();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Dữ liệu thật từ API
  const notifications = notification?.data?.content || [];

  // Đếm số thông báo chưa đọc
  const newNotificationsCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer relative text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {newNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {newNotificationsCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-[400px] right-[-48px] top-[36px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex justify-between items-center border-b p-4">
            <div className="flex items-center gap-2">
              <Bell className="text-indigo-600" />
              <h2 className="text-lg font-semibold">Thông báo</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:opacity-60 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((noti, index) => (
                <div
                  key={noti.id || index}
                  className={`p-3 rounded-lg border flex items-start gap-3 transition ${
                    !noti.is_read
                      ? "bg-indigo-50 border-indigo-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      !noti.is_read ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{noti.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(noti.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                Không có thông báo nào
              </p>
            )}
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
      )}
    </div>
  );
}
