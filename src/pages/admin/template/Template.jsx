import { useEffect, useState } from "react";
import { FileText, Hash, Play, Edit, Trash2 } from "lucide-react";
import { templateStore } from "../../../store/template";
import CreateTemplate from "./CreateTemplate";
import UpdateTemplate from "./UpdateTemplate";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Notification from "../../../utils/notification";

export default function Template() {
  const template = templateStore();
  const [filter, setFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [templateTypeToCreate, setTemplateTypeToCreate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Xác nhận",
    confirmButtonClass: "bg-red-600 hover:bg-red-700",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await template.getAllTemplate();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredTemplates =
    template.data?.filter((t) => {
      if (filter === "all") return true;
      return t.type === filter;
    }) || [];

  const handleUseTemplate = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      Notification("success", "Đã sao chép nội dung vào clipboard!");
    } catch (error) {
      console.error("Lỗi khi sao chép: ", error);
      Notification("error", "Không thể sao chép nội dung.");
    }
  };

  const handleDeteleTemplate = (id) => {
    setConfirmation({
      isOpen: true,
      title: "Xóa Template",
      message: "Bạn có chắc chắn muốn xóa template này không?",
      onConfirm: async () => {
        const response = await template.deleteTemplate(id);
        if (response.success) {
          Notification("success", "Xóa template thành công!");
          template.getAllTemplate();
        } else {
          Notification("error", "Không thể xóa template!");
        }
        closeConfirmation();
      },
      confirmText: "Xóa",
      confirmButtonClass: "bg-red-600 hover:bg-red-700",
    });
  };

  const closeConfirmation = () =>
    setConfirmation({ ...confirmation, isOpen: false });

  const handleOpenCreateModal = (type) => {
    setTemplateTypeToCreate(type);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setTemplateTypeToCreate(null);
  };

  const handleOpenUpdateModal = (template) => {
    setEditingTemplate(template);
  };

  const handleCloseUpdateModal = () => {
    setEditingTemplate(null);
    template.getAllTemplate(); // Tải lại danh sách sau khi cập nhật
  };

  return (
    <div className="min-h-screen mt-16">
      {/* Header chính */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Templates & Watermarks
        </h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleOpenCreateModal("caption")}
            className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition bg-blue-600 text-white/90 hover:bg-blue-700"
          >
            <FileText size={16} /> Tạo Caption
          </button>
          <button
            onClick={() => handleOpenCreateModal("hashtag")}
            className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition bg-emerald-600 text-white/90 hover:bg-emerald-700"
          >
            <Hash size={16} /> Tạo Hashtag
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <span className="font-medium text-gray-800 mr-2">
          Bộ lọc Templates:
        </span>
        {[
          {
            key: "all",
            label: "Tất cả",
            activeClass: "bg-gray-800 text-white",
            inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200",
          },
          {
            key: "caption",
            label: "Caption",
            activeClass: "bg-blue-600 text-white",
            inactiveClass: "bg-blue-100 text-blue-700 hover:bg-blue-200",
          },
          {
            key: "hashtag",
            label: "Hashtag",
            activeClass: "bg-green-600 text-white",
            inactiveClass: "bg-green-100 text-green-700 hover:bg-green-200",
          },
        ].map(({ key, label, activeClass, inactiveClass }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              filter === key ? activeClass : inactiveClass
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Danh sách templates */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((t, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {/* Header của từng template */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-full ${
                      t.type === "hashtag"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {t.type === "hashtag" ? (
                      <Hash size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base capitalize">
                      {t.type} {t.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {t.category?.name || "Không có danh mục"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    t.type === "hashtag"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {t.type}
                </span>
              </div>

              {/* Nội dung */}
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {t.content}
              </p>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(t.content)}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-green-600"
                  >
                    <Play size={14} /> Sử dụng
                  </button>
                  <button
                    onClick={() => handleOpenUpdateModal(t)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Edit size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeteleTemplate(t.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            ⏳ Đang tải dữ liệu hoặc chưa có template nào.
          </p>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateTemplate
          open={isCreateModalOpen}
          type={templateTypeToCreate}
          onClose={handleCloseCreateModal}
        />
      )}

      {editingTemplate && (
        <UpdateTemplate
          template={editingTemplate}
          // categories={categories}
          onClose={() => setEditingTemplate(null)}
          onSuccess={handleCloseUpdateModal}
        />
      )}

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={confirmation.onConfirm}
        onClose={closeConfirmation}
        confirmText={confirmation.confirmText}
        confirmButtonClass={confirmation.confirmButtonClass}
      />
    </div>
  );
}
