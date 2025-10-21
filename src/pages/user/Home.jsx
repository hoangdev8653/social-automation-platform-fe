// src/pages/Home.jsx
import React, { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("all");

  // ✅ Dữ liệu mẫu bài viết của user
  const mockPosts = [
    {
      id: 1,
      caption: "Hôm nay là một ngày thật tuyệt vời 🌞",
      hashtags: ["#happy", "#sunnyday"],
      status: "published",
      created_at: "2025-10-15T08:30:00Z",
      media: [
        {
          url: "https://images.unsplash.com/photo-1503264116251-35a269479413?w=400",
        },
        {
          url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
        },
      ],
    },
    {
      id: 2,
      caption: "Đang viết bài mới, chưa hoàn thiện 😅",
      hashtags: ["#draft", "#working"],
      status: "draft",
      created_at: "2025-10-16T10:45:00Z",
      media: [],
    },
    {
      id: 3,
      caption: "Bài viết đang chờ duyệt bởi admin 💭",
      hashtags: ["#waiting", "#approval"],
      status: "pending_approval",
      created_at: "2025-10-14T09:00:00Z",
      media: [
        {
          url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400",
        },
      ],
    },
    {
      id: 4,
      caption: "Bài viết bị từ chối do vi phạm nội dung ❌",
      hashtags: ["#rejected"],
      status: "rejected",
      created_at: "2025-10-12T13:10:00Z",
      media: [],
    },
    {
      id: 5,
      caption: "Lên lịch đăng bài cho cuối tuần 📅",
      hashtags: ["#scheduled", "#planning"],
      status: "scheduled",
      created_at: "2025-10-11T19:20:00Z",
      media: [
        {
          url: "https://images.unsplash.com/photo-1536305030431-73c8f87e83d3?w=400",
        },
      ],
    },
  ];

  // ✅ Lọc bài viết theo trạng thái
  const filteredPosts =
    filter === "all" ? mockPosts : mockPosts.filter((p) => p.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Bài viết của tôi</h1>

      {/* Bộ lọc trạng thái */}
      <div className="flex flex-wrap gap-3 m-6">
        {[
          "all",
          "draft",
          "pending_approval",
          "scheduled",
          "published",
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
                    : post.status === "pending_approval"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {post.status.replace("_", " ")}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <p className="text-gray-800 font-medium mb-1">{post.caption}</p>
            {post.hashtags && (
              <p className="text-blue-600 text-sm">{post.hashtags.join(" ")}</p>
            )}

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
              <button className="text-blue-600 text-sm hover:underline">
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
