import React, { useState } from "react";
import { Eye, Edit, Trash2, PlusCircle, Filter } from "lucide-react";
import AddPost from "./AddPost";

const Post = () => {
  const [open, setOpen] = useState(false);
  const [posts] = useState([
    {
      id: 1,
      content:
        "🎉 Chào mừng đến với sản phẩm mới của chúng tôi! Khám phá những tính năng tuyệt vời...",
      platforms: ["facebook", "instagram"],
      page: "Công ty ABC - Fanpage, Instagram Business",
      status: "Đã đăng",
      author: "Unknown",
      time: "17:00:00",
      date: "15/1/2024",
      media: "3 ảnh",
    },
    {
      id: 2,
      content:
        "📹 Video hướng dẫn chi tiết cách sử dụng sản phẩm ABC. Xem ngay để không bỏ lỡ...",
      platforms: ["tiktok", "youtube"],
      page: "Demo TikTok Channel, YouTube Channel",
      status: "Đã lên lịch",
      author: "Unknown",
      time: "22:00:00",
      date: "16/1/2024",
      media: "1 ảnh, 1 video",
    },
    {
      id: 3,
      content:
        "💼 Tips và tricks để tối ưu hiệu suất làm việc với công nghệ mới nhất. Chia sẻ ngay...",
      platforms: ["facebook", "twitter", "threads"],
      page: "Công ty ABC - Fanpage, Twitter Business",
      status: "Đã duyệt",
      author: "Unknown",
      time: "19:00:00",
      date: "17/1/2024",
      media: "2 ảnh",
    },
  ]);

  const deletePost = async (id) => {
    alert("Bạn chắc chắn muốn xóa bài viết này !");
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý bài đăng</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <PlusCircle size={20} />
          Thêm bài đăng
        </button>
      </div>
      <AddPost isOpen={open} onClose={() => setOpen(false)} />
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-center mb-6">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Tất cả trạng thái</option>
          <option>Đã đăng</option>
          <option>Đã duyệt</option>
          <option>Đã lên lịch</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Tất cả nền tảng</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>TikTok</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Tất cả tác giả</option>
          <option>Admin</option>
          <option>User</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left">
            <tr>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Nền tảng</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Tác giả</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{post.content}</p>
                  <p className="text-sm text-blue-600 mt-1">{post.media}</p>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {post.platforms.map((pf, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {pf}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-700">{post.page}</td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                      post.status === "Đã đăng"
                        ? "bg-blue-100 text-blue-700"
                        : post.status === "Đã lên lịch"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>

                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">
                  <p>{post.time}</p>
                  <p className="text-gray-500 text-xs">{post.date}</p>
                </td>

                <td className="px-4 py-8 flex gap-3 justify-center text-gray-600 ">
                  <Eye
                    className="cursor-pointer hover:text-blue-600"
                    size={18}
                  />
                  <Edit
                    className="cursor-pointer hover:text-emerald-600"
                    size={18}
                  />
                  <Trash2
                    onClick={() => deletePost(post.id)}
                    className="cursor-pointer hover:text-red-600"
                    size={18}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Post;
