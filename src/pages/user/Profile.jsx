import React, { useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    timezone: "Asia/Ho_Chi_Minh",
    avatar: "https://i.pravatar.cc/150?img=3",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, avatar: url });
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("✅ Thông tin đã được cập nhật!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Hồ sơ cá nhân</h1>
      </header>

      <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
        {/* Avatar */}
        <div className="flex items-center gap-6 border-b pb-6 mb-6">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <label
              htmlFor="avatarUpload"
              className="cursor-pointer text-blue-600 hover:underline"
            >
              Đổi ảnh đại diện
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Thông tin cá nhân */}
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
              Múi giờ
            </label>
            <select
              name="timezone"
              value={profile.timezone}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="UTC">UTC (GMT+0)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
          <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
