import { useEffect, useState } from "react";
import { postStore } from "../../store/post";
import PreviewPost from "../admin/post/PreviewPost";

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

  // ✅ Lọc bài viết theo trạng thái
  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="p-6 mt-8">
      {/* Bộ lọc trạng thái */}
      <div className="flex flex-wrap gap-3 m-6">
        {[
          "all",
          "draft",
          "pending_approval",
          "scheduled",
          "published",
          "failed",
          "rejected",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all"
              ? "Tất cả"
              : status
                  .replace("_", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Danh sách bài viết */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`px-2 py-1 text-xs rounded capitalize ${
                  post.status === "published"
                    ? "bg-green-100 text-green-700"
                    : post.status === "draft"
                    ? "bg-yellow-100 text-yellow-700"
                    : post.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : post.status === "pending_approval" ||
                      post.status === "failed"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {post.status.replace("_", " ")}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <p className="text-gray-800 font-medium mb-1">{post.caption}</p>
            {/* {post.hashtags && (
              <p className="text-blue-600 text-sm">{post.hashtags.join(" ")}</p>
            )} */}
            <p className="text-blue-600 text-sm">{post.hashtags}</p>

            {/* Hình ảnh */}
            {post.media?.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {post.media.slice(0, 3).map((m, idx) => (
                  <img
                    key={idx}
                    src={m.url}
                    alt=""
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handlePreview(post.id)}
                className="text-blue-600 text-sm hover:underline"
              >
                Xem chi tiết
              </button>
              <button className="text-gray-600 text-sm hover:underline">
                Sửa
              </button>
              <button className="text-red-600 text-sm hover:underline">
                Xóa
              </button>
            </div>
          </div>
        ))}
        <PreviewPost
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          postId={selectedPost}
        />
      </div>

      {/* Không có bài viết */}
      {filteredPosts.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          Không có bài viết nào thuộc trạng thái này.
        </p>
      )}
    </div>
  );
}
