import React from "react";
import { Edit3, Video, Share2, Users, Plus } from "lucide-react";

const stats = [
  {
    title: "Tổng bài đăng",
    value: 3,
    change: "+12 hôm nay",
    icon: <Edit3 className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Video đã xử lý",
    value: 2,
    change: "+5 hôm nay",
    icon: <Video className="w-6 h-6 text-green-600" />,
  },
  {
    title: "Page kết nối",
    value: 5,
    change: "2 mới kết nối",
    icon: <Share2 className="w-6 h-6 text-purple-600" />,
  },
  {
    title: "Nhân viên",
    value: 8,
    change: "Tất cả hoạt động",
    icon: <Users className="w-6 h-6 text-gray-700" />,
  },
];

const Dashboard = () => {
  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tổng quan hệ thống
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100"
          >
            <div>
              <h2 className="text-gray-600 font-medium">{item.title}</h2>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
              <span className="text-sm text-green-600">{item.change}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Thao tác nhanh
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <Plus size={18} /> Tạo bài đăng
          </button>
          <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
            <Video size={18} /> Upload video
          </button>
          <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2">
            <Users size={18} /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Hoạt động gần đây
        </h2>
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <p className="text-gray-700">
            Nhân viên đăng bài lên Facebook thành công
          </p>
          <span className="text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
            Thành công
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">
            Video “World Cup Highlights” đã xử lý xong
          </p>
          <span className="text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
            Hoàn tất
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
