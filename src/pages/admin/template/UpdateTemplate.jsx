import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function UpdateTemplate({
  template,
  categories,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    content: "",
  });

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || "",
        category_id: template.category_id || "",
        content: template.content || "",
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/template/${template.id}`, formData);
      toast.success("Cập nhật Template thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Lỗi khi cập nhật Template");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[550px] max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Chỉnh sửa Caption Template
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên template
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
            >
              <option value="">Chọn danh mục</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Nội dung Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung Caption
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none"
            ></textarea>
            <p className="text-gray-500 text-xs mt-1">
              Sử dụng [PLACEHOLDER] để tạo chỗ trống có thể thay thế. Ví dụ:
              [PRODUCT_NAME], [PRICE], [CONTACT]
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
            >
              💾 Lưu Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
