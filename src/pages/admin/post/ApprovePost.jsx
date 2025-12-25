import { useState } from "react";
import { X } from "lucide-react";
import { postStore } from "../../../store/post";
import Notification from "../../../utils/notification";
import { useNavigate } from "react-router-dom";

const ApprovePost = ({ isOpen, onClose, postId, onActionComplete }) => {
  const Navigate = useNavigate();
  const [reason, setReason] = useState("");
  const { approvePost, rejectPost, loading } = postStore();
  if (!isOpen) return null;

  const handleApprovePost = async () => {
    const response = await approvePost(postId);

    if (response?.status == 200) {
      setTimeout(() => {
        Navigate("/dashboard/post");
      }, 3000);
      Notification("success", "Bài viết đã được đăng lên các nền tảng");
      onClose();
    } else {
      Notification("error", "Bài viết không thể đăng lên các nền tảng");
    }
    onActionComplete?.(); // Luôn gọi callback để tải lại dữ liệu
  };

  const handleRejectPost = async () => {
    const response = await rejectPost(postId, reason);
    if (response.status == 200) {
      Notification("success", "Bài viết đã được từ chối xét duyệt");
      onClose();
    } else {
      Notification("error", "Từ chối bài viết thất bại");
    }
    onActionComplete?.(); // Luôn gọi callback để tải lại dữ liệu
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg relative">
        <button
          onClick={!loading ? onClose : undefined}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-3">Duyệt bài viết</h2>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng xem xét bài viết này. Bạn có muốn duyệt hay từ chối?
        </p>

        <div className="space-y-3">
          <textarea
            placeholder="Nhập lý do từ chối (nếu có)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
            rows={3}
          ></textarea>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (reason.trim() && !loading) {
                  handleRejectPost();
                }
              }}
              disabled={loading || !reason.trim()}
              className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Từ chối
            </button>
            <button
              onClick={() => handleApprovePost()}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Đang xử lý..." : "Duyệt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovePost;
