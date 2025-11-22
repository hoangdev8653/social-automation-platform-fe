import { useEffect, useState } from "react";
import { Eye, Trash2, PlusCircle, Filter, Check, X } from "lucide-react";
import AddPost from "./AddPost";
import { postStore } from "../../../store/post";
import formatDate from "../../../utils/formatDate";
import { postTargetStore } from "../../../store/postTarget";
import PreviewPost from "../../../components/PreviewPost";
import ApprovePost from "./ApprovePost";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { toast } from "react-toastify";

const Post = () => {
  const [open, setOpen] = useState(false);
  const post = postStore();
  const postTarget = postTargetStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await post.getAllPost();
      await postTarget.getAllPostTaget();
    };
    fetchData();
  }, []);

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
            toast.success("Bài viết đã được xóa thành công.");
            await postTarget.getAllPostTaget(); // Tải lại dữ liệu
          } else {
            toast.error("Xóa bài viết thất bại.");
          }
        } catch (error) {
          toast.error("Đã xảy ra lỗi khi xóa bài viết.");
        }
        closeConfirmation();
      },
    });
  };

  return (
    <div className=" bg-gray-50 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý bài đăng</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <PlusCircle size={20} />
          Thêm bài đăng
        </button>
      </div>
      <AddPost isOpen={open} onClose={() => setOpen(false)} />
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-center mb-6">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Tất cả trạng thái</option>
          <option>Đã đăng</option>
          <option>Đã duyệt</option>
          <option>Đã lên lịch</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Tất cả nền tảng</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>TikTok</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Tất cả tác giả</option>
          <option>Admin</option>
          <option>User</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left">
            <tr>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Nền tảng</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(
              (postTarget?.data?.content || []).reduce((acc, item) => {
                const postId = item.Post.id;
                if (!acc[postId]) {
                  acc[postId] = {
                    postId,
                    caption: item.Post.caption,
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
              }, {})
            ).map((grouped) => {
              // Nếu có ít nhất 1 nền tảng failed → toàn bài coi là failed
              const finalStatus = grouped.statuses.includes("failed")
                ? "failed"
                : grouped.statuses.includes("published")
                ? "published"
                : "pending";

              return (
                <tr
                  key={grouped.postId}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* Nội dung bài viết */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {grouped.caption.length > 150
                        ? `${grouped.caption.slice(0, 150)}...`
                        : grouped.caption}
                    </p>
                  </td>

                  {/* Nền tảng */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {grouped.platforms.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-blue-200 px-2  py-1 rounded-full"
                        >
                          <span className="text-xs text-blue-600">
                            {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Page */}
                  <td className="px-4 py-3 text-gray-700">
                    {grouped.platforms.map((p, i) => (
                      <div key={i} className="text-sm my-1">
                        {p.accountName}
                      </div>
                    ))}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        finalStatus === "published"
                          ? "bg-blue-100 text-blue-700"
                          : finalStatus === "failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {finalStatus === "published"
                        ? "Đã đăng"
                        : finalStatus === "failed"
                        ? "Đăng thất bại"
                        : "Đang chờ duyệt"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(grouped.createdAt)}
                  </td>

                  <td className="px-4 text-center align-middle">
                    <div className="flex gap-3 justify-center text-gray-600">
                      <Eye
                        onClick={() => handlePreview(grouped.postId)}
                        className="cursor-pointer hover:text-blue-600"
                        size={18}
                      />

                      <button
                        disabled={finalStatus !== "pending"}
                        onClick={() => handleOpenApproveModal(grouped.postId)}
                        title={
                          finalStatus === "pending"
                            ? "Duyệt bài viết"
                            : "Chỉ có thể duyệt khi trạng thái là 'Đang chờ duyệt'"
                        }
                        className={`transition flex items-center justify-center
    ${
      finalStatus === "pending"
        ? "text-emerald-600 hover:text-emerald-500 cursor-pointer"
        : "text-gray-400 cursor-not-allowed"
    }`}
                      >
                        <Check size={18} />
                      </button>

                      <Trash2
                        onClick={() => handleDeletePost(grouped.postId)}
                        className="cursor-pointer hover:text-red-600"
                        size={18}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    </div>
  );
};

export default Post;
