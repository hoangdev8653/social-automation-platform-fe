import React, { useState } from "react";

const ConnectPage = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    platform: "Facebook",
    connectMethod: "manual",
    pageName: "",
    pageId: "",
    accessToken: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ConnectPage.jsx: Gửi dữ liệu page đến API:", formData);
    // TODO: Thêm logic gọi API để lưu page mới ở đây
    // Sau khi API trả về thành công:
    onSuccess(); // Báo cho component cha biết để tải lại danh sách
    onClose(); // Đóng modal
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Kết nối Page mới</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Chọn nền tảng */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chọn nền tảng
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            >
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="X">X (Twitter)</option>
            </select>
          </div>

          {/* Phương thức kết nối */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phương thức kết nối
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="connectMethod"
                  value="oauth"
                  checked={formData.connectMethod === "oauth"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span>OAuth (Khuyến dùng)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="connectMethod"
                  value="manual"
                  checked={formData.connectMethod === "manual"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span>Nhập thủ công</span>
              </label>
            </div>
          </div>

          {/* Tên Page */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên Page/Channel
            </label>
            <input
              type="text"
              name="pageName"
              value={formData.pageName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập tên page..."
            />
          </div>

          {/* Page ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Page ID</label>
            <input
              type="text"
              name="pageId"
              value={formData.pageId}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              placeholder="Nhập Page ID..."
            />
          </div>

          {/* Access Token */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Access Token
            </label>
            <textarea
              name="accessToken"
              value={formData.accessToken}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 h-24 focus:ring focus:ring-blue-200 resize-none"
              placeholder="Nhập access token..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
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
              💾 Kết nối Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectPage;
