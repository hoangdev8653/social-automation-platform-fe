import React, { useState } from "react";
import { X, Clock, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "facebook",
    "instagram",
    "tiktok",
  ]);
  const [postOption, setPostOption] = useState("schedule"); // "now" | "schedule"
  const [scheduledTime, setScheduledTime] = useState("");
  const [hashtags, setHashtags] = useState("");
  const navigate = useNavigate();

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold text-center mx-auto m-4">
          Tạo bài đăng mới
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <div className="max-w-3xl mx-auto">
          {/* Nội dung bài đăng */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Nội dung bài đăng</label>
            <textarea
              className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập nội dung bài đăng..."
            ></textarea>
          </div>

          {/* Nền tảng & Page */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-medium mb-2">Chọn nền tảng</h3>
              {[
                "facebook",
                "instagram",
                "tiktok",
                "youtube",
                "twitter",
                "threads",
                "pinterest",
              ].map((platform) => (
                <label
                  key={platform}
                  className="flex items-center gap-2 mb-1 capitalize"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                  />
                  {platform}
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-medium mb-2">Chọn Page</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Công ty ABC - Fanpage{" "}
                  <span className="text-gray-500 text-sm">(facebook)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Demo TikTok Channel{" "}
                  <span className="text-gray-500 text-sm">(tiktok)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Instagram Business{" "}
                  <span className="text-gray-500 text-sm">(instagram)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ảnh & Video */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-medium mb-2">Hình ảnh</h3>
              <input type="file" className="border rounded-lg w-full p-2" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Video</h3>
              <input
                type="file"
                accept="video/*"
                className="border rounded-lg w-full p-2"
              />
            </div>
          </div>

          {/* Frame Templates */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Frame Templates (Tùy chọn)</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm mb-1">Frame cho Hình ảnh</label>
                <select className="border rounded-lg w-full p-2">
                  <option>Không sử dụng frame</option>
                  <option>Frame 1</option>
                  <option>Frame 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Frame cho Video</label>
                <select className="border rounded-lg w-full p-2">
                  <option>Không sử dụng frame</option>
                  <option>Frame 1</option>
                  <option>Frame 2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Watermark Templates */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Watermark Templates (Tùy chọn)</h3>
            <select className="border rounded-lg w-full p-2">
              <option>Không sử dụng watermark</option>
              <option>Watermark 1</option>
              <option>Watermark 2</option>
            </select>
          </div>

          {/* Lựa chọn đăng bài */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Lựa chọn đăng bài</h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="postOption"
                  checked={postOption === "now"}
                  onChange={() => setPostOption("now")}
                />
                <div>
                  <p className="font-medium text-green-700">Đăng ngay</p>
                  <p className="text-gray-500 text-sm">
                    Đăng bài lên các nền tảng đã chọn ngay lập tức
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="postOption"
                  checked={postOption === "schedule"}
                  onChange={() => setPostOption("schedule")}
                />
                <div>
                  <p className="font-medium text-blue-700">Lên lịch đăng</p>
                  <p className="text-gray-500 text-sm">
                    Đặt thời gian đăng bài trong tương lai
                  </p>
                </div>
              </label>
            </div>

            {/* Nếu là lên lịch đăng thì hiện thêm phần thời gian */}
            {postOption === "schedule" && (
              <div className="mt-4 w-full md:w-1/2">
                <label className="block text-sm mb-1 font-medium">
                  Thời gian đăng
                </label>
                <input
                  type="datetime-local"
                  className="border rounded-lg w-full p-2"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Hashtags */}
          <div className="mb-6 w-full md:w-2/3">
            <h3 className="font-medium mb-2">Hashtags (Tùy chọn)</h3>
            <input
              type="text"
              placeholder="#hashtag1 #hashtag2"
              className="border rounded-lg w-full p-2"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 border-t pt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                postOption === "schedule"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {postOption === "schedule" ? <Clock size={18} /> : null}
              {postOption === "schedule" ? "Lên lịch đăng" : "Đăng bài"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
