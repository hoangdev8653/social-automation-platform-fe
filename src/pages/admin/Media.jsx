import React, { useState } from "react";
import {
  Search,
  Upload,
  UploadCloud,
  Eye,
  Edit2,
  Download,
  Trash2,
} from "lucide-react";

const Media = () => {
  const [view, setView] = useState("grid");

  const stats = [
    { title: "Hình ảnh", count: 4, icon: "🖼️" },
    { title: "Video", count: 1, icon: "🎥" },
    { title: "Audio", count: 0, icon: "🎧" },
    { title: "GB đã dùng", count: "0.0", icon: "💾" },
  ];

  const medias = [
    {
      id: 1,
      name: "product-showcase.jpg",
      size: "1.95 MB",
      date: "10/1/2024",
      type: "IMAGE",
      preview:
        "https://res.cloudinary.com/dtcvzzsvv/image/upload/v1740289360/health-talk/yclkezhdpwfw3pucstj5.jpg",
    },
    {
      id: 2,
      name: "team-meeting.jpg",
      size: "1.47 MB",
      date: "11/1/2024",
      type: "IMAGE",
      preview:
        "https://res.cloudinary.com/dtcvzzsvv/image/upload/v1747042830/health-talk/r0bqxyalbmqbounyyz4s.jpg",
    },
    {
      id: 3,
      name: "office-workspace.jpg",
      size: "1.8 MB",
      date: "9/1/2024",
      type: "IMAGE",
      preview:
        "https://res.cloudinary.com/dtcvzzsvv/image/upload/v1759752222/social-automation-platform/huqjtfohc8668r9qotly.jpg",
    },
    {
      id: 4,
      name: "promotional-video.mp4",
      size: "15 MB",
      date: "12/1/2024",
      type: "VIDEO",
      preview:
        "https://res.cloudinary.com/dtcvzzsvv/image/upload/v1747043449/health-talk/anilecl6qdugffuixhad.jpg",
    },
    {
      id: 5,
      name: "company-logo.png",
      size: "240 KB",
      date: "8/1/2024",
      type: "IMAGE",
      preview:
        "https://res.cloudinary.com/dtcvzzsvv/image/upload/v1750350884/smartCV/jugkk9ytsiahdwb2uchz.jpg",
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Thư viện Media</h1>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <UploadCloud size={18} /> Upload Media
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Upload size={18} /> Bulk Upload
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-5 flex flex-col items-center"
          >
            <span className="text-4xl">{item.icon}</span>
            <p className="text-2xl font-bold mt-2">{item.count}</p>
            <p className="text-gray-600">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select className="border rounded-lg px-3 py-2">
          <option>Tất cả loại</option>
          <option>Hình ảnh</option>
          <option>Video</option>
          <option>Audio</option>
        </select>

        <select className="border rounded-lg px-3 py-2">
          <option>Tất cả thời gian</option>
          <option>Tuần này</option>
          <option>Tháng này</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm media..."
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800">
          <Search size={16} /> Lọc
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg ${
              view === "grid" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            🟦
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg ${
              view === "list" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            📋
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-5 gap-4">
          {medias.map((m) => (
            <div
              key={m.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={m.preview}
                  alt={m.name}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {m.type}
                </span>
              </div>
              <div className="p-3 text-sm">
                <p className="font-semibold truncate">{m.name}</p>
                <p className="text-gray-500 text-xs">{m.size}</p>
                <p className="text-gray-400 text-xs">{m.date}</p>

                <div className="flex justify-around mt-2 text-gray-600">
                  <Eye
                    size={16}
                    className="cursor-pointer hover:text-blue-600"
                  />
                  <Edit2
                    size={16}
                    className="cursor-pointer hover:text-green-600"
                  />
                  <Download
                    size={16}
                    className="cursor-pointer hover:text-purple-600"
                  />
                  <Trash2
                    size={16}
                    className="cursor-pointer hover:text-red-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>List View Coming Soon</div>
      )}
    </div>
  );
};

export default Media;
