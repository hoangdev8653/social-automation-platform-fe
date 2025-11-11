import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { userStore } from "../../../store/user";
import { toast } from "react-toastify";

const UpdateRole = ({ user, onClose, onSave }) => {
  const [role, setRole] = useState("");
  const store = userStore();

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          {/* Vai trò */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Chọn vai trò...</option>
              <option value="admin">Admin</option>
              <option value="user">Nhân viên</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer hover:opacity-80"
            >
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRole;
