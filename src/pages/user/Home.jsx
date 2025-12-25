import { useEffect, useState } from "react";
import { postStore } from "../../store/post";
import PreviewPost from "../../components/PreviewPost";
import {
  MoreHorizontal,
  ExternalLink,
  Image as ImageIcon,
  Video,
} from "lucide-react";

export default function Home() {
  const [filter, setFilter] = useState("all");
  const post = postStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await post.getPostByUser();
    };
    fetchData();
  }, []);

  const handlePreview = (postId) => {
    setSelectedPost(postId);
    setIsPreviewOpen(true);
  };

  const posts = post?.data?.content || [];

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  // 1. Cập nhật helper màu sắc để hỗ trợ missed_schedule
  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-50 text-green-700 border-green-200",
      scheduled: "bg-blue-50 text-blue-700 border-blue-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      missed_schedule: "bg-yellow-50 text-yellow-700 border-yellow-200", // Màu vàng cảnh báo
      draft: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  // 2. Định nghĩa danh sách các tab bộ lọc bạn muốn hiển thị
  const filterTabs = [
    { id: "all", label: "Tất cả" },
    { id: "published", label: "Đã đăng" },
    { id: "scheduled", label: "Đã lên lịch" },
    { id: "failed", label: "Thất bại" },
    { id: "missed_schedule", label: "Bị lỡ lịch" },
  ];

  const renderHashtags = (tagString) => {
    if (!tagString) return null;
    const tags = tagString.split(" ").filter((t) => t.startsWith("#"));
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded-md font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* --- HEADER BỘ LỌC --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 mt-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Quản lý bài đăng
        </h1>

        {/* 3. Render danh sách nút bấm nằm ngang */}
        <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                filter === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- DANH SÁCH BÀI VIẾT --- */}
      <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 pb-10">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="break-inside-avoid bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative overflow-hidden"
            onClick={() => handlePreview(post.id)}
          >
            {/* Header Card */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Facebook Page
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Badge trạng thái */}
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${getStatusColor(
                  post.status
                )}`}
              >
                {/* Logic hiển thị text badge */}
                {post.status === "missed_schedule"
                  ? "Bị lỡ lịch"
                  : post.status === "published"
                  ? "Đã đăng"
                  : post.status === "scheduled"
                  ? "Đã lên lịch"
                  : post.status === "failed"
                  ? "Thất bại"
                  : post.status}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-gray-800 text-sm leading-relaxed line-clamp-4">
                {post.caption}
              </p>
              {renderHashtags(post.hashtags)}
            </div>

            {/* Media Gallery */}
            {post.media?.length > 0 && (
              <div
                className={`grid gap-1 mt-3 rounded-lg overflow-hidden ${
                  post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {post.media.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className={`relative ${
                      post.media.length === 3 && index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt="media"
                        loading="lazy"
                        className="w-full h-full object-cover aspect-video hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="relative w-full aspect-video bg-black">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <Video size={24} />
                        </div>
                      </div>
                    )}
                    {index === 3 && post.media.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                        +{post.media.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-400">ID: #{post.id}</span>
              <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                Xem chi tiết <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <MoreHorizontal size={32} />
          </div>
          <p>Không có bài viết nào thuộc trạng thái này.</p>
        </div>
      )}

      <PreviewPost
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        postId={selectedPost}
      />
    </div>
  );
}
