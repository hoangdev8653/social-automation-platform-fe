import React, { useState, useEffect } from "react";
import { X, Save, FileText, Hash } from "lucide-react";
import { toast } from "react-toastify";
import { templateStore } from "../../../store/template";
import { templateCategoryStore } from "../../../store/templateCategory";

export default function CreateTemplate({ open, onClose, type }) {
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    content: "",
    type: "caption",
  });
  const [categories, setCategories] = useState([]);
  const template = templateStore();
  const templateCategory = templateCategoryStore();

  useEffect(() => {
    if (type) {
      setForm((prev) => ({ ...prev, type: type }));
    }
  }, [type]);

  // Lấy danh mục từ store hoặc API
  useEffect(() => {
    if (open) {
      const fetchCategory = async () => {
        try {
          const res = await templateCategory.getAllTemplateCategory();
          setCategories(res?.data?.content || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchCategory();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category_id || !form.content.trim()) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      console.log(form);
      // await template.createTemplate(form);
      // toast.success("Thêm template thành công!");
      // onClose();
      // setForm({ title: "", category_id: "", content: "", type: "caption" });
      // await template.getAllTemplate(); // refresh danh sách
    } catch (err) {
      toast.error("Không thể thêm template!");
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    // 1. Wrapper: Thêm p-4 để modal không dính sát lề mobile
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* 2. Container: max-h-[90vh] để đảm bảo không bị tràn màn hình dọc */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header - Cố định */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {form.type === "caption" ? (
              <FileText className="text-blue-600" size={24} />
            ) : (
              <Hash className="text-emerald-600" size={24} />
            )}
            <span>Thêm {form.type === "caption" ? "Caption" : "Hashtag"}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Có thanh cuộn */}
        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form
            id="create-template-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Tên Template */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên template <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Ví dụ: Mẫu chào buổi sáng..."
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {/* Mũi tên custom cho select nếu cần, hoặc để mặc định */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nội dung {form.type === "caption" ? "Caption" : "Hashtag"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                rows={6}
                placeholder={`Nhập nội dung mẫu...`}
                value={form.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none font-sans text-sm leading-relaxed"
              />

              {/* Gợi ý Placeholder */}
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs text-blue-800">
                  <span className="font-bold">Mẹo:</span> Sử dụng{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-600 font-bold">
                    [TỪ_KHÓA]
                  </code>{" "}
                  để tạo vị trí điền nhanh.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="text-[10px] px-2 py-1 bg-white rounded border border-blue-100 text-gray-600 cursor-pointer hover:border-blue-300 transition"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        content: prev.content + " [TÊN_SP] ",
                      }))
                    }
                  >
                    + [TÊN_SP]
                  </span>
                  <span
                    className="text-[10px] px-2 py-1 bg-white rounded border border-blue-100 text-gray-600 cursor-pointer hover:border-blue-300 transition"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        content: prev.content + " [GIÁ] ",
                      }))
                    }
                  >
                    + [GIÁ]
                  </span>
                  <span
                    className="text-[10px] px-2 py-1 bg-white rounded border border-blue-100 text-gray-600 cursor-pointer hover:border-blue-300 transition"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        content: prev.content + " [LIÊN_HỆ] ",
                      }))
                    }
                  >
                    + [LIÊN_HỆ]
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions - Cố định */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition"
          >
            <Save size={18} /> Lưu Template
          </button>
        </div>
      </div>
    </div>
  );
}
