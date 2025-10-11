import React from "react";
import { Bell, LogOut, Users } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-3">
      {/* Left - Title */}
      <div className="flex items-center space-x-2">
        <Users className="text-blue-500 w-6 h-6" />
        <h1 className="text-xl font-semibold text-gray-800">Social Platform</h1>
      </div>

      {/* Right - Notification + User + Logout */}
      <div className="flex items-center space-x-4">
        {/* Notification */}
        <button className="relative text-gray-600 hover:text-gray-800 focus:outline-none">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            3
          </span>
        </button>

        {/* User */}
        <div className="flex gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <span className="text-xs text-gray-500 text-center">Admin</span>
          </div>
        </div>

        {/* Logout Button */}
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition">
          <LogOut className="w-4 h-4 mr-2" />
          Đăng Xuất
        </button>
      </div>
    </header>
  );
};

export default Header;
