import { X } from "lucide-react";
import formatDate from "../utils/formatDate";
import { postStore } from "../store/post";
import { useEffect, useState } from "react";

export default function PreviewPost({ isOpen, onClose, postId }) {
  const post = postStore();
  const [postDetail, setPostDetail] = useState(null);

  useEffect(() => {
    if (postId != null && isOpen != false) {
      {
        const fetchData = async () => {
          const response = await post.getPostById(postId);
          setPostDetail(response?.content);
        };
        fetchData();
      }
    }
  }, [postId]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute hover:opacity-60 top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer "
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Chi tiết bài đăng</h2>

        {/* Thông tin cơ bản */}
        <div className="flex justify-between items-start bg-gray-50 p-4 rounded-xl mb-6">
          <div>
            <p className="font-semibold">ID Bài đăng</p>
            <p className="text-gray-700">{postDetail?.id}</p>
            <div className="mt-3">
              <p className="font-semibold">Tác giả</p>
              <div className="flex items-center gap-3 mt-1">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                  alt={postDetail?.author?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{postDetail?.author?.name}</p>
                  <p className="text-sm text-gray-500">
                    {postDetail?.author?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="font-semibold">Trạng thái</p>
            <span
              className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                postDetail?.status === "published"
                  ? "bg-blue-100 text-blue-700"
                  : postDetail?.status === "failed"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {postDetail?.status === "published"
                ? "Đã đăng"
                : postDetail?.status === "failed"
                ? "Đăng thất bại"
                : "Đang chờ duyệt"}
            </span>

            <p className="font-semibold mt-4">Thời gian tạo</p>
            <p className="text-gray-700">{formatDate(postDetail?.createdAt)}</p>
          </div>
        </div>

        {/* Nội dung bài đăng */}
        <div className="mb-6">
          <p className="font-semibold mb-2">Nội dung bài đăng</p>
          <div className="border rounded-xl p-4 text-gray-800 bg-gray-50">
            {postDetail?.caption}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">
            {postDetail?.media?.length > 0 && (
              <>
                {postDetail.media.length}{" "}
                {postDetail.media[0].type === "image" ? "Hình Ảnh" : "Video"}
              </>
            )}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {postDetail?.media?.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-xl border">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={`post-${index}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-48 object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <p className="font-semibold mb-2">Hashtags</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">
              {postDetail?.hashtags}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
