import { useState } from "react";
import { X } from "lucide-react";
import { postStore } from "../../../store/post";
import Notification from "../../../utils/notification";

const ApprovePost = ({ isOpen, onClose, postId }) => {
  const [reason, setReason] = useState("");
  const post = postStore();
  if (!isOpen) return null;

  const handleApprovePost = async () => {
    const response = await post.approvePost();
    if (response.status == 200) {
      Notification("success", "Bài viết đã được đăng lên các nền tảng");
    }
  };

  const handleRejectPost = async (reason) => {
    const response = await post.rejectPost(postId, reason);
    if (response.status == 200) {
      Notification("success", "Bài viết đã được từ chối xét duyệt");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
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
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
            rows={3}
          ></textarea>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (reason.trim()) onReject(reason);
                handleRejectPost;
              }}
              className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white"
            >
              Từ chối
            </button>
            <button
              onClick={handleApprovePost}
              className="px-4 py-2 text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Duyệt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovePost;
