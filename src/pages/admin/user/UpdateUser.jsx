import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const UpdateUser = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        employeeCode: user.id || "",
        fullName: user.name || "",
        email: user.email || "",
        status: user.status || "Hoạt động",
        role: user.role || "",
        password: "", // Để trống mật khẩu khi sửa
        permission: user.permissions?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Loại bỏ mật khẩu nếu nó rỗng
    const dataToSave = { ...formData };
    if (!dataToSave.password) {
      delete dataToSave.password;
    }
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cập nhật thông tin nhân viên</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 -mr-2 -mt-2"
          >
            <X size={24} className="text-gray-600" />
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
              value={formData.username || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500"
              disabled
            />
          </div>

          {/* Mã nhân viên */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã nhân viên
            </label>
            <input
              type="text"
              name="employeeCode"
              value={formData.employeeCode || ""}
              disabled
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500"
            />
          </div>

          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập email"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status || "Hoạt động"}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Tạm nghỉ">Tạm nghỉ</option>
            </select>
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Chọn vai trò...</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Content Editor">Content Editor</option>
            </select>
          </div>

          {/* Mật khẩu */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 pr-10 focus:ring focus:ring-blue-200"
              placeholder="Để trống nếu không đổi"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Quyền hạn */}
          <div>
            <label className="block text-sm font-medium mb-1">Quyền hạn</label>
            <input
              type="text"
              name="permission"
              value={formData.permission || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập quyền hạn, cách nhau bởi dấu phẩy"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
