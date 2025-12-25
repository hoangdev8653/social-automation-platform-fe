import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react"; // Import thêm icon Eye cho đẹp
import { userStore } from "../../../store/user";
import { toast } from "react-toastify";

const AddUser = ({ onClose }) => {
  const store = userStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await store.createUser(formData);
    if (response && response.status === 201) {
      toast.success("Thêm nhân viên mới thành công!");
      await store.getAllUser();
      onClose();
    } else {
      toast.error(response?.data?.message || "Thêm nhân viên thất bại.");
    }
  };

  return (
    // 1. Thêm p-4 để modal cách lề trên mobile
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      {/* 2. max-w-2xl là đủ rộng, w-full để full width trên mobile, max-h để scroll nếu màn hình quá bé */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Thêm nhân viên mới
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Scrollable nếu nội dung dài */}
        <div className="p-5 md:p-6 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Tên đăng nhập */}
            <div className="md:col-span-2">
              {" "}
              {/* Để Username full hàng hoặc bỏ class này nếu muốn chia cột */}
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="example@mail.com"
              />
            </div>

            {/* Mật khẩu */}
            <div className="col-span-1 relative">
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-12 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            {/* col-span-1 md:col-span-2: Để vùng nút bấm luôn chiếm hết chiều ngang */}
            <div className="col-span-1 md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-center"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition text-center flex justify-center items-center gap-2"
              >
                💾 Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
