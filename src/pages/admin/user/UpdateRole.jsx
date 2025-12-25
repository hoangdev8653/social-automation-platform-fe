import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react"; // Thêm icon Save cho đẹp
import { userStore } from "../../../store/user";
import { toast } from "react-toastify";

const UpdateRole = ({ user, onClose }) => {
  const [role, setRole] = useState("");
  const store = userStore();

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      toast.warning("Vui lòng chọn vai trò.");
      return;
    }

    const response = await store.updateUserRole(user.id, role);
    if (response.status === 200) {
      toast.success("Cập nhật vai trò thành công!");
      await store.getAllUser();
      onClose();
    } else {
      toast.error("Cập nhật vai trò thất bại.");
    }
  };

  return (
    // 1. Thêm p-4 để cách lề trên mobile, backdrop-blur cho đẹp
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      {/* 2. Đổi max-w-3xl thành max-w-md vì form này ít nội dung */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Cập nhật vai trò</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Thông tin user đang sửa (Optional - giúp admin biết đang sửa ai) */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">
                Nhân viên:{" "}
                <span className="font-bold">
                  {user?.name || user?.username}
                </span>
              </p>
              <p className="text-xs text-blue-600 mt-1">{user?.email}</p>
            </div>

            {/* Vai trò Select */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Vai trò hệ thống <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition bg-white cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    Chọn vai trò...
                  </option>
                  <option value="admin">Admin (Quản trị viên)</option>
                  <option value="user">User (Nhân viên)</option>
                </select>
                {/* Custom Arrow Icon for Select if needed, or stick with default */}
              </div>
            </div>

            {/* Footer Buttons */}
            {/* Mobile: Nút dọc, Desktop: Nút ngang */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-center"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition text-center flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRole;
