import { useEffect, useState } from "react";
import { Edit3, Video, Users, Plus } from "lucide-react";
import { mediaStore } from "../../store/media";
import { userStore } from "../../store/user";
import { postTargetStore } from "../../store/postTarget";
import { socialAccountStore } from "../../store/socialAccount";
import { Link } from "react-router-dom";
import { activityStore } from "../../store/activity";
import { ITEMS_PER_PAGE } from "../../utils/constants";
import Paginate from "../../components/Paginate";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

const Dashboard = () => {
  const media = mediaStore();
  const user = userStore();
  const postTarget = postTargetStore();
  const socialAccount = socialAccountStore();
  const activity = activityStore();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      await media.getAllMedia();
      await postTarget.getAllPostTaget();
      await user.getAllUser();
      await socialAccount.getAllSocialAccount();
      const response = await activity.getAllActivity({
        page,
        limit: ITEMS_PER_PAGE,
      });
      setTotalPages(response?.data?.totalPages || 1);
    };
    fetchData();
  }, [page]);

  return (
    <div className=" bg-gray-50 min-h-screen ">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tổng quan hệ thống
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100">
          <div>
            <h2 className="text-gray-600 font-medium">Tổng Media</h2>
            <p className="text-2xl font-bold mt-1">{media?.data?.totalItem}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100">
          <div>
            <h2 className="text-gray-600 font-medium">Page kết nối</h2>
            <p className="text-2xl font-bold mt-1">
              {socialAccount?.data?.totalItem}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100">
          <div>
            <h2 className="text-gray-600 font-medium">Bài viết</h2>
            <p className="text-2xl font-bold mt-1">
              {postTarget?.data?.totalItem}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100">
          <div>
            <h2 className="text-gray-600 font-medium">Nhân viên</h2>
            <p className="text-2xl font-bold mt-1">{user?.data?.totalItem}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Thao tác nhanh
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard/post"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Tạo bài đăng
          </Link>
          <Link
            to="/dashboard/page"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <Video size={18} /> Kết nối Page
          </Link>
          <Link
            to="/dashboard/user"
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <Users size={18} /> Thêm nhân viên
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Hoạt động gần đây
        </h2>
        {activity?.data?.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-3 mb-3  border-gray-200"
          >
            <div>
              <p className="text-gray-700">{item?.details}</p>
              <span className="text-xs">{formatTimeAgo(item?.created_at)}</span>
            </div>
            <span className="text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
              {item?.action}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Paginate
          pageCount={totalPages}
          onPageChange={(newPage) => setPage(newPage.selected + 1)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
