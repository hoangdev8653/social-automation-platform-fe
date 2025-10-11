import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Search,
} from "lucide-react";
// Giả sử bạn có icon TikTok, nếu không có thể dùng icon mặc định
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.52.02c1.31-.02 2.61.1 3.88.34 1.27.24 2.5.62 3.68 1.14 1.18.52 2.3 1.18 3.28 1.98.98.8 1.82 1.74 2.52 2.78.7 1.04 1.26 2.18 1.68 3.4.42 1.22.7 2.5.84 3.86.14 1.36.16 2.78.02 4.24-.14 1.46-.42 2.88-.84 4.24-.42 1.32-.98 2.58-1.68 3.74-.7 1.16-1.54 2.22-2.52 3.1-.98.88-2.1 1.64-3.28 2.26-1.18.62-2.42 1.12-3.68 1.5-1.27.38-2.58.64-3.88.78-1.3.14-2.62.16-3.98.02-1.36-.14-2.7-.38-3.98-.78-1.28-.4-2.52-.9-3.68-1.5-1.18-.62-2.3-1.36-3.28-2.26-.98-.9-1.82-1.92-2.52-3.1-.7-1.18-1.26-2.42-1.68-3.74-.42-1.36-.7-2.78-.84-4.24-.14-1.46-.16-2.92.02-4.38.14-1.46.42-2.9.84-4.24.42-1.34.98-2.6 1.68-3.76.7-1.16 1.54-2.24 2.52-3.12.98-.88 2.1-1.64 3.28-2.26 1.18-.62 2.42-1.12 3.68-1.5C9.82.12 11.22.02 12.52.02z"></path>
    <path d="M12 7.35c-1.32 0-2.5.52-3.4 1.4-1.8 1.8-1.8 4.7 0 6.5 1.8 1.8 4.7 1.8 6.5 0 .4-.4.7-.8.9-1.3"></path>
    <path d="M12 7.35v5.3"></path>
    <path d="M15.3 12.65c-.4.4-.9.7-1.4.9"></path>
  </svg>
);

const platformStats = [
  {
    name: "Facebook",
    icon: <Facebook className="text-blue-600" />,
    count: 1,
  },
  {
    name: "Instagram",
    icon: <Instagram className="text-pink-500" />,
    count: 1,
  },
  { name: "TikTok", icon: <TikTokIcon className="text-black" />, count: 1 },
  { name: "YouTube", icon: <Youtube className="text-red-500" />, count: 1 },
  { name: "Twitter", icon: <Twitter className="text-sky-500" />, count: 1 },
];

const pagesData = [
  {
    id: "123456789",
    name: "Công ty ABC - Fanpage",
    platform: "Facebook",
    username: "@abcpage",
    followers: 15420,
    lastSync: "15/1/2024",
    connected: true,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "@demochannel",
    name: "Demo TikTok Channel",
    platform: "TikTok",
    username: "@demochannel",
    followers: 8750,
    lastSync: "15/1/2024",
    connected: true,
    avatar: "https://i.pravatar.cc/100?img=8",
  },
  {
    id: "@techcorp_official",
    name: "Instagram Business",
    platform: "Instagram",
    username: "@techcorp_official",
    followers: 12350,
    lastSync: "15/1/2024",
    connected: true,
    avatar: "https://i.pravatar.cc/100?img=6",
  },
  {
    id: "@ytchannel",
    name: "YouTube Channel",
    platform: "YouTube",
    username: "@ytchannel",
    followers: 21800,
    lastSync: "15/1/2024",
    connected: true,
    avatar: "https://i.pravatar.cc/100?img=10",
  },
  {
    id: "@twitterbiz",
    name: "Twitter Business",
    platform: "Twitter",
    username: "@twitterbiz",
    followers: 5620,
    lastSync: "15/1/2024",
    connected: true,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
];

export default function ManagerPage() {
  const [pages] = useState(pagesData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Page</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Plus size={16} /> Kết nối Page mới
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {platformStats.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4"
          >
            <div className="text-3xl">{p.icon}</div>
            <div>
              <h3 className="font-bold text-xl">{p.count}</h3>
              <p className="text-sm text-gray-500">{p.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm page..."
            className="border rounded-lg px-3 py-2 pl-10 w-full focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
        <select className="border rounded-lg px-3 py-2 bg-white">
          <option>Tất cả nền tảng</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>TikTok</option>
          <option>YouTube</option>
          <option>Twitter</option>
        </select>
        <select className="border rounded-lg px-3 py-2 bg-white">
          <option>Tất cả trạng thái</option>
          <option>Kết nối</option>
          <option>Ngắt kết nối</option>
        </select>
      </div>

      {/* Page List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={page.avatar}
                alt={page.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-base">{page.name}</h3>
                  <p className="text-sm text-gray-500">
                    {page.platform} • {page.username}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <p className="text-gray-500">Followers</p>
                <p className="font-semibold">
                  {page.followers.toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Đồng bộ cuối</p>
                <p className="font-semibold">{page.lastSync}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  page.connected
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {page.connected ? "Đã kết nối" : "Đã ngắt"}
              </span>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <RefreshCw size={16} className="text-blue-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Settings size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
