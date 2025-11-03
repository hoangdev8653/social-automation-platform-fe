import React, { useEffect, useState } from "react";
import { FileText, Hash, Play } from "lucide-react";
import { templateStore } from "../../store/template";
import { toast } from "react-toastify";

export default function Template() {
  const [filter, setFilter] = useState("all");
  const template = templateStore();

  useEffect(() => {
    const fetchData = async () => {
      await template.getAllTemplate();
    };
    fetchData();
  }, []);

  const handleUseTemplate = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Đã sao chép nội dung vào clipboard!");
    } catch (err) {
      console.error("Lỗi khi sao chép: ", err);
      toast.error("Không thể sao chép nội dung.");
    }
  };

  const filteredTemplates =
    template.data?.filter((t) => {
      if (filter === "all") return true;
      return t.type === filter;
    }) || [];

  return (
    <div className="min-h-screen bg-gray-50 m-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Templates</h1>
        <div className="flex gap-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
            <FileText size={16} /> Caption
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <Hash size={16} /> Hashtag
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
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
                <button
                  onClick={() => handleUseTemplate(t.content)}
                  className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-green-600"
                >
                  <Play size={14} /> Sử dụng
                </button>
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
