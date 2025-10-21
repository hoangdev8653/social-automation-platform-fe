import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  UploadCloud,
  Eye,
  Edit2,
  Download,
  Trash2,
  X,
} from "lucide-react";
import { mediaStore } from "../../store/media";

const Media = () => {
  const [view, setView] = useState("grid");
  const [viewingMedia, setViewingMedia] = useState(null); // State để quản lý media đang xem
  const media = mediaStore();

  useEffect(() => {
    const fetchData = async () => {
      await media.getAllMedia();
    };
    fetchData();
  }, []);

  console.log("media: ", media.data);

  // ===> TÍNH TOÁN THỐNG KÊ DỰA TRÊN DỮ LIỆU THẬT
  const images = media.data?.content?.filter((m) => m.type === "image") || [];
  const videos = media.data?.content?.filter((m) => m.type === "video") || [];
  const audios = media.data?.content?.filter((m) => m.type === "audio") || [];

  const totalSizeInBytes =
    media.data?.content?.reduce((sum, m) => sum + (m.metadata?.size || 0), 0) ||
    0;
  const totalSizeInGB = (totalSizeInBytes / (1024 * 1024 * 1024)).toFixed(2);

  const stats = [
    { title: "Hình ảnh", count: images.length, icon: "🖼️" },
    { title: "Video", count: videos.length, icon: "🎥" },
    { title: "Audio", count: audios.length, icon: "🎧" },
    { title: "GB đã dùng", count: totalSizeInGB, icon: "💾" },
  ];

  return (
    <div>
      {/* Header */}
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
          {media?.data?.content?.length === 0 ? (
            <p className="text-gray-500">Không có media nào</p>
          ) : (
            media?.data?.content?.map((m) => (
              <div
                key={m.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="relative">
                  {m.type === "video" ? (
                    <video
                      src={m.url}
                      className="w-full h-40 object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={m.url}
                      alt={m.metadata?.filename}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <span
                    className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded ${
                      m.type === "image"
                        ? "bg-blue-600"
                        : m.type === "video"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {m.type.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 text-sm">
                  <p className="font-semibold truncate">
                    {m.metadata?.filename}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {(m.metadata?.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(m.createdAt).toLocaleString("vi-VN")}
                  </p>

                  <div className="flex justify-around mt-2 text-gray-600">
                    <Eye
                      size={16}
                      onClick={() => setViewingMedia(m)}
                      className="cursor-pointer hover:text-blue-600"
                    />
                    <Edit2
                      size={16}
                      className="cursor-pointer hover:text-green-600"
                    />
                    <Download
                      size={16}
                      className="cursor-pointer hover:text-purple-600"
                      onClick={() => window.open(m.url, "_blank")}
                    />
                    <Trash2
                      size={16}
                      className="cursor-pointer hover:text-red-600"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>List View Coming Soon</div>
      )}

      {/* Modal xem trước Media */}
      {viewingMedia && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setViewingMedia(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-4 relative max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg truncate">
                {viewingMedia.metadata?.filename}
              </h3>
              <button
                onClick={() => setViewingMedia(null)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {viewingMedia.type === "video" ? (
                <video
                  src={viewingMedia.url}
                  className="max-w-full max-h-full"
                  controls
                  autoPlay
                />
              ) : (
                <img src={viewingMedia.url} className="max-w-full max-h-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
