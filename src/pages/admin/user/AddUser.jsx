import React, { useState } from "react";
import { X } from "lucide-react";
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
      await store.getAllUser(); // Tải lại danh sách người dùng
      onClose();
    } else {
      toast.error(response?.data?.message || "Thêm nhân viên thất bại.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Thêm nhân viên mới</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 -mr-2 -mt-2"
          >
            <X size={24} className="text-gray-600 cursor-pointer" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Tên đăng nhập */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập email"
            />
          </div>

          {/* Mật khẩu */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 pr-10 focus:ring focus:ring-blue-200"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer hover:opacity-80 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="cursor-pointer hover:opacity-80 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              💾 Đăng kí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
