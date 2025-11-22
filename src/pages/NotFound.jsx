import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center h-screen text-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-6xl md:text-8xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
          Trang không tồn tại
        </h2>
        <p className="text-gray-600 mt-2">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home size={18} /> Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
