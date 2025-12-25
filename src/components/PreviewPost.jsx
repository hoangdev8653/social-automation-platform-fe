import {
  X,
  Calendar,
  User,
  AlignLeft,
  Hash,
  Image as ImageIcon,
  Clock,
  Save,
} from "lucide-react";
import formatDate from "../utils/formatDate";
import { postStore } from "../store/post";
import { useEffect, useState } from "react";

export default function PreviewPost({ isOpen, onClose, postId }) {
  const post = postStore();
  const [postDetail, setPostDetail] = useState(null);

  const [newScheduleTime, setNewScheduleTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (postId != null && isOpen !== false) {
      const fetchData = async () => {
        const response = await post.getPostById(postId);
        setPostDetail(response?.content);
        setIsRescheduling(false);
        setNewScheduleTime("");
      };
      fetchData();
    }
  }, [postId, isOpen]);

  const handleSaveReschedule = async () => {
    if (!newScheduleTime) return;

    console.log("Thời gian hẹn lại:", newScheduleTime);

    alert(`Đã hẹn lại lịch đăng vào: ${newScheduleTime}`);
    setIsRescheduling(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-6 pr-8 text-gray-800">
          Chi tiết bài đăng
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-start bg-gray-50 p-4 rounded-xl mb-6 gap-4 sm:gap-0 border border-gray-100">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                ID: {postDetail?.id}
              </span>
            </div>

            <p className="font-semibold text-sm text-gray-500 mb-1 flex items-center gap-1">
              <User size={14} /> Tác giả
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                alt={postDetail?.author?.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {postDetail?.author?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {postDetail?.author?.email}
                </p>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: TRẠNG THÁI & THỜI GIAN --- */}
          <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-none border-gray-200 pt-3 sm:pt-0">
            <p className="font-semibold text-sm text-gray-500 mb-1">
              Trạng thái
            </p>

            <div className="flex flex-col sm:items-end gap-2">
              <span
                className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap gap-1 ${
                  postDetail?.status === "published"
                    ? "bg-blue-100 text-blue-700"
                    : postDetail?.status === "failed"
                    ? "bg-red-100 text-red-600"
                    : postDetail?.status === "scheduled"
                    ? "bg-purple-100 text-purple-700"
                    : postDetail?.status === "missed_schedule"
                    ? "bg-yellow-100 text-yellow-700" // Đổi màu vàng cho dễ nhìn (missed)
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {/* Logic hiển thị Text */}
                {postDetail?.status === "published"
                  ? "Đã đăng"
                  : postDetail?.status === "failed"
                  ? "Thất bại"
                  : postDetail?.status === "scheduled"
                  ? "Đã lên lịch"
                  : postDetail?.status === "missed_schedule"
                  ? "Bị lỡ lịch"
                  : "Chờ duyệt"}

                {/* YÊU CẦU 1: Icon đồng hồ xoay nếu là scheduled */}
                {postDetail?.status === "scheduled" && (
                  <Clock size={14} className="animate-spin" />
                )}
              </span>

              {/* YÊU CẦU 2: Calendar input nếu là missed_schedule */}
              {postDetail?.status === "missed_schedule" && (
                <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                  {!isRescheduling ? (
                    <button
                      onClick={() => setIsRescheduling(true)}
                      className="text-xs flex items-center gap-1 font-semibold text-yellow-700 hover:text-yellow-800 underline decoration-dotted"
                    >
                      <Calendar size={12} /> Đặt lại thời gian ngay
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        className="text-xs p-1 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 bg-white"
                        value={newScheduleTime}
                        onChange={(e) => setNewScheduleTime(e.target.value)}
                      />
                      <button
                        onClick={handleSaveReschedule}
                        disabled={!newScheduleTime}
                        className="p-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded disabled:opacity-50 transition"
                        title="Lưu lịch mới"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => setIsRescheduling(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="font-semibold text-sm text-gray-500 mt-3 sm:mt-4 mb-1 flex items-center sm:justify-end gap-1">
              <Calendar size={14} /> Thời gian tạo
            </p>
            <p className="text-sm font-medium text-gray-800">
              {formatDate(postDetail?.createdAt)}
            </p>
          </div>
        </div>

        {/* --- NỘI DUNG BÀI ĐĂNG --- */}
        <div className="mb-6">
          <p className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
            <AlignLeft size={18} /> Nội dung
          </p>
          <div className="border border-gray-200 rounded-xl p-4 text-gray-800 bg-white shadow-sm text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
            {postDetail?.caption}
          </div>
        </div>

        {/* --- MEDIA (HÌNH ẢNH/VIDEO) --- */}
        {postDetail?.media?.length > 0 && (
          <div className="mb-6">
            <p className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <ImageIcon size={18} />
              {postDetail.media.length}{" "}
              {postDetail.media[0].type === "image" ? "Hình Ảnh" : "Video"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {postDetail?.media?.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-gray-200 shadow-sm group"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={`post-${index}`}
                      className="w-full h-48 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-48 sm:h-40 object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- HASHTAGS --- */}
        {postDetail?.hashtags && (
          <div>
            <p className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <Hash size={18} /> Hashtags
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium border border-blue-100">
                {postDetail?.hashtags}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
