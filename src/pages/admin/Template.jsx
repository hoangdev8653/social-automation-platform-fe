import { useEffect, useState } from "react";
import { FileText, Hash, Play, Plus, Edit, Trash2 } from "lucide-react";
import { templateStore } from "../../store/template";
import { toast } from "react-toastify";

export default function Template() {
  const template = templateStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      await template.getAllTemplate(); // Gọi API lấy dữ liệu template
    };
    fetchData();
  }, []);

  // Lọc template dựa trên state filter
  const filteredTemplates =
    template.data?.filter((t) => {
      if (filter === "all") return true;
      return t.type === filter;
    }) || [];

  const handleUseTemplate = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Đã sao chép nội dung vào clipboard!");
    } catch (err) {
      console.error("Lỗi khi sao chép: ", err);
      toast.error("Không thể sao chép nội dung.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Templates</h1>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={16} /> Thêm Template
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Hash size={16} /> Hashtag
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <span className="font-medium text-gray-800 mr-2">
          Bộ lọc Templates:
        </span>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            filter === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter("caption")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            filter === "caption"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          Caption
        </button>
        <button
          onClick={() => setFilter("hashtag")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            filter === "hashtag"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          Hashtag
        </button>
      </div>

      {/* Danh sách templates */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {/* Header */}
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
                    <h3 className="font-semibold text-gray-800 text-base">
                      {t.title}
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

              {/* Content */}
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {t.content}
              </p>

              {/* Footer */}

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(t.content)}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-green-600"
                  >
                    <Play size={14} /> Sử dụng
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Edit size={16} className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <p>{new Date(t.createdAt).toLocaleDateString("vi-VN")}</p>
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
    </div>
  );
}
