import React, { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Trash2,
  X,
  Upload,
  Search,
  PlayCircle,
} from "lucide-react";
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

  const images = media?.data?.summary?.totalImage;
  const videos = media?.data?.summary?.totalVideo;
  const audios = media?.data?.summary?.totalAudio;

  console.log(media?.data?.summary?.totalSize);

  const totalSizeInMB = (
    media?.data?.summary?.totalSize /
    (1024 * 1024)
  ).toFixed(2);

  const stats = [
    {
      title: "Hình ảnh",
      count: images,
      icon: "🖼️",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Video",
      count: videos,
      icon: "🎥",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Audio",
      count: audios,
      icon: "🎧",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Dung lượng",
      count: `${totalSizeInMB} MB`,
      icon: "💾",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "download");
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    // Nên thêm confirm trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa file này?")) return;

    const response = await media.deleteMedia(id);
    if (response?.status == 200) {
      Notification("success", "Xóa thành công");
      await media.getAllMedia({ page, limit: ITEMS_PER_PAGE });
    }
  };

  return (
    <div className=" px-4 sm:px-0 pb-20 sm:pb-0">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Media</h1>
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition shadow-sm shadow-blue-200">
          <Upload size={18} /> <span>Tải lên Media</span>
        </button>
      </div>

      {/* --- STATS --- */}
      {/* Mobile: 2 cột (grid-cols-2), Desktop: 4 cột */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <div
              className={`p-2 sm:p-3 rounded-xl text-xl sm:text-2xl ${
                stat.color || "bg-gray-50"
              }`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {stat.title}
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                {stat.count}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white border-gray-100 p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative w-full sm:flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm media..."
            className="border border-gray-200 rounded-xl px-3 py-2.5 pl-10 w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
          />
        </div>

        <select
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả loại</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {/* --- GRID MEDIA --- */}
      {/* Mobile: 2 cột, Tablet: 3 cột, Desktop: 5 cột */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {filteredMedia.map((m, index) => (
          <div
            key={index}
            className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl overflow-hidden transition group"
          >
            <div className="relative overflow-hidden bg-gray-100">
              {m.type === "video" ? (
                <>
                  <video
                    onClick={() => setViewingMedia(m)}
                    src={m.url}
                    className="w-full h-32 sm:h-40 object-cover cursor-pointer"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                    <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full shadow-lg">
                      <PlayCircle
                        size={32}
                        className="text-white fill-white/20"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <img
                  onClick={() => setViewingMedia(m)}
                  src={m.url}
                  alt={m.metadata?.filename}
                  className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
              )}
            </div>

            <div className="p-3">
              <p
                className="truncate text-xs sm:text-sm font-medium text-gray-700 mb-2"
                title={m.metadata?.filename}
              >
                {m.metadata?.filename || "Untitled"}
              </p>

              {/* Action Buttons Row for Mobile (Since hover doesn't work well on touch) */}
              <div className="flex justify-between items-center sm:hidden border-t pt-2 mt-2 border-gray-50">
                <Eye
                  size={16}
                  onClick={() => setViewingMedia(m)}
                  className="text-gray-500"
                />
                <Download
                  size={16}
                  onClick={() => handleDownload(m.url, m.metadata?.filename)}
                  className="text-gray-500"
                />
                <Trash2
                  size={16}
                  onClick={() => handleDelete(m.id)}
                  className="text-red-500"
                />
              </div>

              {/* Action Buttons Row for Desktop (Optional addition or rely on hover) */}
              <div className="hidden sm:flex justify-between items-center mt-2">
                <span className="text-[10px] text-gray-400 uppercase">
                  {m.type}
                </span>
                <div className="flex items-center gap-3">
                  <Eye
                    size={14}
                    onClick={() => setViewingMedia(m)}
                    className="cursor-pointer text-gray-400 hover:text-blue-600"
                    title="Xem"
                  />
                  <Download
                    size={14}
                    onClick={() => handleDownload(m.url, m.metadata?.filename)}
                    className="cursor-pointer text-gray-400 hover:text-green-600"
                    title="Tải xuống"
                  />
                  <Trash2
                    size={14}
                    onClick={() => handleDelete(m.id)}
                    className="cursor-pointer text-gray-400 hover:text-red-600"
                    title="Xóa"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
          Không tìm thấy media nào.
        </div>
      )}

      {/* --- MODAL VIEWING --- */}
      {viewingMedia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-3  bg-gray-50">
              <h3 className="font-medium text-gray-700 truncate max-w-[80%]">
                {viewingMedia.metadata?.filename}
              </h3>
              <button
                onClick={() => setViewingMedia(null)}
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition cursor-pointer"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="flex-1 overflow-auto p-4 bg-black/5 flex items-center justify-center">
              {viewingMedia.type === "video" ? (
                <video
                  src={viewingMedia.url}
                  className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={viewingMedia.url}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
                  alt="Preview"
                />
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-3  bg-white flex justify-end gap-3">
              <button
                onClick={() =>
                  handleDownload(
                    viewingMedia.url,
                    viewingMedia.metadata?.filename
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer transition"
              >
                <Download size={16} /> Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Paginate
          pageCount={totalPages}
          onPageChange={(newPage) => setPage(newPage.selected + 1)}
        />
      </div>
    </div>
  );
};

export default Media;
