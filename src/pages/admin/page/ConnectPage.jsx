import React, { useState } from "react";
import { X, Globe, Link, ShieldCheck } from "lucide-react";

const ConnectPage = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    platform: "Facebook",
    connectMethod: "oauth",
    pageName: "",
    pageId: "",
    accessToken: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOAuthConnect = () => {
    const lowerPlatform = formData.platform.toLowerCase();
    const oauthUrl = `https://localhost:3007/api/v1/${lowerPlatform}`;
    const popup = window.open(oauthUrl, "_blank", "width=800,height=700");

    const listener = (event) => {
      if (
        event.origin !== "https://localhost:3007" ||
        event.data?.type !== "oauth_success"
      ) {
        return;
      }

      const { pages } = event.data;

      if (pages && pages.length > 0) {
        const firstPage = pages[0];
        console.log("Đã nhận được dữ liệu từ popup:", firstPage);

        setFormData((prev) => ({
          ...prev,
          pageName: firstPage.name,
          pageId: firstPage.id,
          accessToken: firstPage.access_token,
        }));

        popup?.close();
        window.removeEventListener("message", listener);
        alert(`Đã kết nối với trang: ${firstPage.name}`);
      } else {
        alert("Không tìm thấy trang Facebook nào để kết nối.");
        popup?.close();
        window.removeEventListener("message", listener);
      }
    };

    window.addEventListener("message", listener);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ConnectPage.jsx: Gửi dữ liệu page đến API:", formData);
    onSuccess();
    onClose();
  };

  const platformLabel = {
    Facebook: "Facebook",
    Instagram: "Instagram",
    YouTube: "YouTube",
    TikTok: "TikTok",
    X: "Twitter",
  }[formData.platform];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Kết nối Page mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Chọn nền tảng
              </label>
              <div className="relative">
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="X">X (Twitter)</option>
                </select>
                <Globe
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Phương thức kết nối
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.connectMethod === "oauth"
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="connectMethod"
                    value="oauth"
                    checked={formData.connectMethod === "oauth"}
                    onChange={handleChange}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-800">
                      OAuth
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      Khuyên dùng
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.connectMethod === "manual"
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="connectMethod"
                    value="manual"
                    checked={formData.connectMethod === "manual"}
                    onChange={handleChange}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className="font-medium text-sm text-gray-800">
                    Nhập thủ công
                  </span>
                </label>
              </div>
            </div>

            {formData.connectMethod === "oauth" && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 text-blue-600 shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-semibold text-gray-800">Kết nối bảo mật</h3>
                <p className="text-sm text-gray-600 mt-1 mb-4">
                  Chúng tôi sử dụng chuẩn OAuth 2.0 để kết nối an toàn với{" "}
                  {platformLabel} mà không lưu mật khẩu của bạn.
                </p>
                <button
                  type="button"
                  onClick={handleOAuthConnect}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-200"
                >
                  <Link size={18} /> Kết nối với {platformLabel}
                </button>
              </div>
            )}

            {/* Nhập thủ công */}
            {formData.connectMethod === "manual" && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Tên Page/Channel
                  </label>
                  <input
                    type="text"
                    name="pageName"
                    value={formData.pageName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                    placeholder="Ví dụ: Shop Quần Áo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Page ID
                  </label>
                  <input
                    type="text"
                    name="pageId"
                    value={formData.pageId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none font-mono text-sm"
                    placeholder="123456789..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Access Token
                  </label>
                  <textarea
                    name="accessToken"
                    value={formData.accessToken}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 h-24 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none font-mono text-xs"
                    placeholder="EAA..."
                  />
                </div>
              </div>
            )}

            {/* Dummy div để tạo khoảng trống cuối khi scroll nếu cần */}
            <div className="h-1"></div>
          </form>
        </div>

        {/* Footer Buttons - Cố định ở dưới (Sticky footer inside modal) */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
          >
            💾 Hoàn tất kết nối
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
