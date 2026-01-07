import { useEffect, useState, useMemo } from "react";
import {
  Eye,
  Trash2,
  PlusCircle,
  Filter,
  Check,
  Calendar,
  Clock,
} from "lucide-react";
import AddPost from "./AddPost";
import { postStore } from "../../../store/post";
import formatDate from "../../../utils/formatDate";
import { postTargetStore } from "../../../store/postTarget";
import PreviewPost from "../../../components/PreviewPost";
import ApprovePost from "./ApprovePost";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import Notification from "../../../utils/notification";

const Post = () => {
  const [open, setOpen] = useState(false);
  const post = postStore();
  const postTarget = postTargetStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");

  const fetchData = async () => {
    try {
      const response = await postTarget.getAllPostTaget({
        page: 1,
        limit: 1000,
      });
      setRawData(response?.data?.content || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processedData = useMemo(() => {
    const grouped = rawData.reduce((acc, item) => {
      const postId = item.Post.id;
      if (!acc[postId]) {
        acc[postId] = {
          postId,
          caption: item.Post.caption || "",
          createdAt: item.createdAt,
          platforms: [],
          statuses: [],
        };
      }
      acc[postId].platforms.push({
        name: item.SocialAccount.platform.name,
        image: item.SocialAccount.platform.image,
        accountName: item.SocialAccount.account_name,
      });
      acc[postId].statuses.push(item.status);
      return acc;
    }, {});

    let result = Object.values(grouped).map((post) => {
      const finalStatus = post.statuses.includes("failed")
        ? "failed"
        : post.statuses.includes("published")
        ? "published"
        : post.statuses.includes("scheduled")
        ? "scheduled"
        : post.statuses.includes("missed_schedule")
        ? "missed_schedule"
        : "pending";

      return { ...post, finalStatus };
    });

    if (searchKeyword) {
      const lowerSearch = searchKeyword.toLowerCase();
      result = result.filter((item) =>
        item.caption.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus) {
      result = result.filter((item) => item.finalStatus === filterStatus);
    }

    if (filterPlatform) {
      // Lọc nếu bài viết có chứa nền tảng được chọn
      result = result.filter((item) =>
        item.platforms.some((p) => p.name === filterPlatform)
      );
    }

    // Bước C: PHÂN TRANG (Client-side Pagination)
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Cắt mảng để lấy dữ liệu cho trang hiện tại
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentData = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      currentData,
      totalPages,
    };
  }, [rawData, searchKeyword, filterStatus, filterPlatform, page]);

  useEffect(() => {
    setPage(1);
  }, [searchKeyword, filterStatus, filterPlatform]);

  const handlePreview = (postId) => {
    setSelectedPost(postId);
    setIsPreviewOpen(true);
  };

  const handleOpenApproveModal = (postId) => {
    setSelectedPost(postId);
    setIsApproveOpen(true);
  };

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const closeConfirmation = () =>
    setConfirmation({ ...confirmation, isOpen: false });

  const handleDeletePost = (postId) => {
    setConfirmation({
      isOpen: true,
      title: "Xác nhận xóa bài viết",
      message: "Bạn có chắc chắn muốn xóa bài viết này không?",
      onConfirm: async () => {
        try {
          const response = await post.deletePost(postId);
          if (response.status === 200) {
            Notification("success", "Bài viết đã được xóa thành công.");
            fetchData(); // Load lại toàn bộ dữ liệu
          } else {
            Notification("error", "Xóa bài viết thất bại.");
          }
        } catch (error) {
          toast.error("Đã xảy ra lỗi khi xóa bài viết.");
        }
        closeConfirmation();
      },
    });
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
        status === "published"
          ? "bg-blue-100 text-blue-700"
          : status === "failed"
          ? "bg-red-100 text-red-600"
          : status === "scheduled"
          ? "bg-cyan-100 text-cyan-600"
          : status === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-orange-100 text-orange-800"
      }`}
    >
      {status === "scheduled" && <Clock size={12} className="animate-spin" />}
      {status === "published"
        ? "Đã đăng"
        : status === "failed"
        ? "Thất bại"
        : status === "scheduled"
        ? "Đã lên lịch"
        : status === "pending"
        ? "Chờ duyệt"
        : "Nhân viên đặt lại thời gian"}
    </span>
  );

  return (
    <div className="bg-gray-50 px-4 sm:px-0 pb-20 sm:pb-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Quản lý bài đăng
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition"
        >
          <PlusCircle size={20} />
          Thêm bài đăng
        </button>
      </div>

      <AddPost isOpen={open} onClose={() => setOpen(false)} />

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 items-center mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full lg:w-auto focus:ring-2 focus:ring-blue-100 outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="published">Đã đăng</option>
          <option value="scheduled">Đã lên lịch</option>
          <option value="pending">Chờ duyệt</option>
          <option value="failed">Thất bại</option>
        </select>

        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full lg:w-auto focus:ring-2 focus:ring-blue-100 outline-none"
        >
          <option value="">Tất cả nền tảng</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="Twitter">Twitter</option>
          <option value="Youtube">Youtube</option>
        </select>

        <div className="relative w-full lg:flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm nội dung..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Nút lọc này giờ chỉ mang tính chất trang trí vì input thay đổi là lọc ngay */}
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow transition">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      {/* TABLE DESKTOP */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left font-semibold">
            <tr>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Nền tảng</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processedData.currentData.map((grouped) => (
              <tr key={grouped.postId} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <p
                    className="font-medium text-gray-800 line-clamp-2"
                    title={grouped.caption}
                  >
                    {grouped.caption}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {grouped.platforms.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-100"
                      >
                        <span className="text-xs font-medium text-blue-700">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {grouped.platforms.map((p, i) => (
                    <div
                      key={i}
                      className="text-xs my-1 truncate max-w-[150px]"
                      title={p.accountName}
                    >
                      {p.accountName}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={grouped.finalStatus} />
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {formatDate(grouped.createdAt)}
                </td>
                <td className="px-4 text-center align-middle">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handlePreview(grouped.postId)}
                      className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-md transition cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      disabled={grouped.finalStatus !== "pending"}
                      onClick={() => handleOpenApproveModal(grouped.postId)}
                      className={`p-1.5 rounded-md transition ${
                        grouped.finalStatus === "pending"
                          ? "hover:bg-emerald-50 text-emerald-600 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Check size={18} />
                    </button>

                    <button
                      onClick={() => handleDeletePost(grouped.postId)}
                      className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-md transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {processedData.currentData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  Không tìm thấy bài đăng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-4">
        {processedData.currentData.map((grouped) => (
          <div
            key={grouped.postId}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <StatusBadge status={grouped.finalStatus} />
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Clock size={12} /> {formatDate(grouped.createdAt)}
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handlePreview(grouped.postId)}
                  className="p-2 bg-gray-50 text-blue-600 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                {grouped.finalStatus === "pending" && (
                  <button
                    onClick={() => handleOpenApproveModal(grouped.postId)}
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDeletePost(grouped.postId)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-800 line-clamp-3 font-medium">
                {grouped.caption}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
              {grouped.platforms.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-blue-50 px-2 py-1.5 rounded-md border border-blue-100"
                >
                  <span className="text-xs font-semibold text-blue-700">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-gray-500 border-l border-blue-200 pl-1.5">
                    {p.accountName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {processedData.currentData.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100 text-gray-500">
            Không tìm thấy bài đăng nào.
          </div>
        )}
      </div>

      <PreviewPost
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        postId={selectedPost}
      />
      <ApprovePost
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        postId={selectedPost}
      />
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={confirmation.onConfirm}
        onClose={closeConfirmation}
        confirmText="Xóa"
      />

      <div className="mt-6">
        <Paginate
          pageCount={processedData.totalPages}
          onPageChange={(newPage) => setPage(newPage.selected + 1)}
        />
      </div>
    </div>
  );
};

export default Post;
