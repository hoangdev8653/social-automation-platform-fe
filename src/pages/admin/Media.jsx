import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, X, Upload, Search } from "lucide-react";
import { mediaStore } from "../../store/media";
import Notification from "../../utils/notification";
import Paginate from "../../components/Paginate";
import { ITEMS_PER_PAGE } from "../../utils/constants";

const Media = () => {
  const [viewingMedia, setViewingMedia] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const media = mediaStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await media.getAllMedia({ page, limit: ITEMS_PER_PAGE });
      setTotalPages(response?.data?.totalPages || 1);
    };

    fetchData();
  }, [page, filterType]);

  const content = media.data?.content || [];

  const filteredMedia =
    filterType === "all"
      ? content
      : content.filter((m) => m.type === filterType);

  const images = content.filter((m) => m.type === "image") || [];
  const videos = content.filter((m) => m.type === "video") || [];
  const audios = content.filter((m) => m.type === "audio") || [];
  const totalSizeInBytes =
    content.reduce((sum, m) => sum + (m.metadata?.size || 0), 0) || 0;
  const totalSizeInMB = (totalSizeInBytes / (1024 * 1024)).toFixed(2);

  const stats = [
    { title: "Hình ảnh", count: images.length, icon: "🖼️" },
    { title: "Video", count: videos.length, icon: "🎥" },
    { title: "Audio", count: audios.length, icon: "🎧" },
    { title: "GB đã dùng", count: totalSizeInMB, icon: "💾" },
  ];

  // --- DOWNLOAD KHÔNG GỌI API ---
  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "download");
    link.target = "_blank"; // Mở tab mới nếu browser chặn download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    const response = await media.deleteMedia(id);
    if (response?.status == 200) {
      Notification("success", "Xóa thành công");
      await media.getAllMedia({ page, limit: ITEMS_PER_PAGE });
    }
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Media</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Upload size={16} /> Tải lên Media
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
          >
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h2 className="text-2xl font-bold">{stat.count}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border-gray-100 p-4 rounded-xl shadow-sm border flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm media..."
            className="border border-gray-200 rounded-lg px-3 py-2 pl-10 w-full focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <select
          className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả loại</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {/* GRID MEDIA */}
      <div className="grid grid-cols-5 gap-4">
        {filteredMedia.map((m, index) => (
          <div
            key={index}
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
                <img src={m.url} className="w-full h-40 object-cover" />
              )}
            </div>

            <div className="p-3 text-sm">
              <p className="truncate">{m.metadata?.filename}</p>

              <div className="flex justify-around mt-2">
                <Eye
                  size={16}
                  onClick={() => setViewingMedia(m)}
                  className="cursor-pointer hover:text-blue-500"
                />
                {/* Gọi hàm Download đơn giản */}
                <Download
                  size={16}
                  onClick={() => handleDownload(m.url, m.metadata?.filename)}
                  className="cursor-pointer hover:text-green-600"
                />
                <Trash2
                  size={16}
                  onClick={() => handleDelete(m.id)}
                  className="cursor-pointer hover:text-red-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewingMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setViewingMedia(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg"
            >
              <X />
            </button>
            {viewingMedia.type === "video" ? (
              <video src={viewingMedia.url} className="max-h-[80vh]" controls />
            ) : (
              <img
                src={viewingMedia.url}
                className="max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      )}

      <Paginate
        pageCount={totalPages}
        onPageChange={(newPage) => setPage(newPage.selected + 1)}
      />
    </div>
  );
};

export default Media;
