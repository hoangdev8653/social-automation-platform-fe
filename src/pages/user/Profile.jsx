import React, { useState, useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import { userStore } from "../../store/user";
import Notification from "../../utils/notification";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";

export default function Profile() {
  const user = userStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    status: "",
    role: "",
  });
  const userData = getLocalStorage("user");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        status: userData.status || "N/A",
        role: userData.role || "N/A",
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const response = await user.updateUserById(userData.id, profile.name);
    if (response.status == 200) {
      Notification("success", "Cập nhật thông tin thành công");
      const updatedUserData = { ...userData, name: profile.name };
      setLocalStorage("user", updatedUserData);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16 ">
      {/* Header */}

      <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
        {/* Thông tin cá nhân */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mx-auto">
          Hồ sơ cá nhân
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Họ và tên
            </label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              name="email"
              value={profile.email}
              disabled
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Trạng thái
            </label>
            <input
              name="status"
              value={profile.status}
              disabled
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 capitalize"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Vai trò
            </label>
            <input
              name="role"
              value={profile.role}
              disabled
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 capitalize"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={profile.name === userData.name || !profile.name.trim()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Lưu thay đổi
          </button>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
