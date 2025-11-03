import React, { useEffect, useState } from "react";
import { Plus, RefreshCw, Settings, Trash2, Search } from "lucide-react";
import ConnectPage from "./ConnectPage";
import { socialAccountStore } from "../../../store/socialAccount";
import formatDate from "../../../utils/formatData";
import facebook from "../../../assets/facebook.png";
import instagram from "../../../assets/instagram.png";
import tiktok from "../../../assets/tiktok.png";
import twitter from "../../../assets/twitter.png";
import youtube from "../../../assets/youtube.png";
import AvatarFanpage from "../../../components/AvatarFanpage";
import getPlatformUrl from "../../../utils/getPlatformUrl";

export default function Page() {
  const [isConnectPageOpen, setIsConnectPageOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("Tất cả nền tảng");
  const socialAccount = socialAccountStore();

  useEffect(() => {
    const fetchData = async () => {
      await socialAccount.getAllSocialAccount();
    };
    fetchData();
  }, []);

  const handleConnectSuccess = () => {
    console.log("Page.jsx: Kết nối thành công! Tải lại danh sách page...");
    setIsConnectPageOpen(false);
  };

  const handleCountPageFacebook = socialAccount?.data?.content?.filter(
    (page) => page.platform.name === "Facebook"
  ).length;

  const handleCountPageInstagram = socialAccount?.data?.content?.filter(
    (page) => page.platform.name === "Instagram"
  ).length;

  const handleCountPageTikTok = socialAccount?.data?.content?.filter(
    (page) => page.platform.name === "TikTok"
  ).length;

  const handleCountPageYouTube = socialAccount?.data?.content?.filter(
    (page) => page.platform.name === "Youtube"
  ).length;

  const handleCountPageTwitter = socialAccount?.data?.content?.filter(
    (page) => page.platform.name === "Twitter"
  ).length;

  const filteredPages = socialAccount?.data?.content?.filter((page) => {
    if (selectedPlatform === "Tất cả nền tảng") {
      return true;
    }
    return page.platform.name === selectedPlatform;
  });

  return (
    <>
      <div className="space-y-6 mt-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Page</h1>
          <button
            onClick={() => setIsConnectPageOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> Kết nối Page mới
          </button>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* Facebook */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100   p-5 flex items-center gap-4">
            <img src={facebook} alt="Facebook" className="w-10 h-10" />
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">{handleCountPageFacebook}</h3>
              <p className="text-sm text-gray-500">Facebook</p>
            </div>
          </div>
          {/* Instagram */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <img src={instagram} alt="Instagram" className="w-10 h-10" />
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">{handleCountPageInstagram}</h3>
              <p className="text-sm text-gray-500">Instagram</p>
            </div>
          </div>
          {/* TikTok */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <img src={tiktok} alt="TikTok" className="w-10 h-10" />
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">{handleCountPageTikTok}</h3>
              <p className="text-sm text-gray-500">TikTok</p>
            </div>
          </div>
          {/* YouTube */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <img src={youtube} alt="YouTube" className="w-10 h-10" />
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">{handleCountPageYouTube}</h3>
              <p className="text-sm text-gray-500">YouTube</p>
            </div>
          </div>
          {/* Twitter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <img src={twitter} alt="Twitter" className="w-10 h-10" />
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">{handleCountPageTwitter}</h3>
              <p className="text-sm text-gray-500">Twitter</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm page..."
              className="border border-gray-200 rounded-lg px-3 py-2 pl-10 w-full focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white"
          >
            <option value="Tất cả nền tảng">Tất cả nền tảng</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            {/* Giá trị "Youtube" khớp với dữ liệu từ API */}
            <option value="Youtube">YouTube</option>
            <option value="Twitter">Twitter</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <option>Tất cả trạng thái</option>
            <option>Kết nối</option>
            <option>Ngắt kết nối</option>
          </select>
        </div>

        {/* Page List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages?.map((page, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                {/* <img
                  // src={
                  //   page.account_image
                  //     ? page.account_image
                  //     : `https://graph.facebook.com/${page.account_id}/picture?access_token=${page.access_token}`
                  // }
                  src={
                    page.platform === "facebook" ||
                    /^[0-9]+$/.test(page.account_id)
                      ? `https://graph.facebook.com/${page.account_id}/picture?type=large`
                      : page.account_image
                  }
                  alt={page.account_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    // fallback cuối cùng khi ảnh facebook lỗi
                    e.target.src = page.account_image || "/default-avatar.png";
                  }}
                  className="w-16 h-16 rounded-full object-cover border border-gray-100"
                /> */}
                <AvatarFanpage page={page} />
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-base">{page.account_name}</h3>
                    <img
                      className="w-6 h-6 my-1"
                      src={page.platform.image}
                      alt={page.platform.id}
                    />
                    <p className="text-sm text-gray-500">
                      ID: {page.account_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className=" justify-between text-sm text-gray-600 mb-4">
                <div className="flex justify-between my-2">
                  <p className="text-gray-500">Followers</p>
                  <p className="font-semibold">{page.fan_counts || 0} </p>
                </div>
                <div className="flex justify-between my-2">
                  <p className="text-gray-500">Đồng bộ cuối</p>
                  <p className="font-semibold">{formatDate(page.updatedAt)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 ">
                <a
                  href={getPlatformUrl(
                    page.platform.name,
                    page.account_id,
                    page.account_name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  Xem trang
                </a>
                <div className="flex gap-1">
                  <span className="px-3 py-2 rounded-full text-xs font-medium bg-green-100 text-green-700 text-center ">
                    Đã kết nối
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isConnectPageOpen && (
        <ConnectPage
          onClose={() => setIsConnectPageOpen(false)}
          onSuccess={handleConnectSuccess}
        />
      )}
    </>
  );
}
