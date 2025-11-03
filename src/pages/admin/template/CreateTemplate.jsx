import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { toast } from "react-toastify";
import { templateStore } from "../../../store/template";

export default function CreateTemplate({ open, onClose, type }) {
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    content: "",
    type: "caption",
  });
  const [categories, setCategories] = useState([]);
  const template = templateStore();

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
          const res = await template.getAllCategory();
          setCategories(res || []);
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
      await template.createTemplate(form);
      toast.success("Thêm template thành công!");
      onClose();
      setForm({ title: "", category_id: "", content: "", type: "caption" });
      await template.getAllTemplate(); // refresh danh sách
    } catch (err) {
      toast.error("Không thể thêm template!");
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm{" "}
            {form.type === "caption" ? "Caption Template" : "Hashtag Template"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên template
            </label>
            <input
              type="text"
              name="title"
              placeholder="Nhập tên template..."
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Danh mục
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Chọn danh mục...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nội dung {form.type === "caption" ? "Caption" : "Hashtag"}
            </label>
            <textarea
              name="content"
              rows={5}
              placeholder={`Nhập nội dung ${
                form.type === "caption" ? "Caption" : "Hashtag"
              } template...`}
              value={form.content}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <p className="text-sm text-gray-500">
            Sử dụng <span className="font-semibold">[PLACEHOLDER]</span> để tạo
            chỗ trống có thể thay thế. Ví dụ: <code>[PRODUCT_NAME]</code>,{" "}
            <code>[PRICE]</code>, <code>[CONTACT]</code>
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <Save size={16} /> Lưu Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
