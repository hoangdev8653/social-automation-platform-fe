import React, { useEffect, useState, useMemo } from "react";
import { FileText, Hash, Play } from "lucide-react"; // Giữ nguyên Play icon theo UI cũ của bạn
import { templateStore } from "../../store/template";
import Notification from "../../utils/notification";
import Paginate from "../../components/Paginate"; // Import component phân trang

export default function Template() {
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [rawData, setRawData] = useState([]);
  const ITEMS_PER_PAGE = 6;

  const template = templateStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await template.getAllTemplate({ page: 1, limit: 1000 });
      setRawData(response?.data?.content || template.data || []);
    };
    fetchData();
  }, []);

  const processedData = useMemo(() => {
    let result = rawData;

    if (filter !== "all") {
      result = result.filter((item) => item.type === filter);
    }

    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentItems = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      currentItems,
      totalPages,
      totalItems,
    };
  }, [rawData, filter, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleUseTemplate = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      Notification("success", "Đã sao chép nội dung vào clipboard!");
    } catch (err) {
      console.error("Lỗi khi sao chép: ", err);
      Notification("error", "Không thể sao chép nội dung.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 m-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("caption")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <FileText size={16} /> Caption
          </button>
          <button
            onClick={() => setFilter("hashtag")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
          >
            <Hash size={16} /> Hashtag
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {processedData.currentItems.length > 0 ? (
          processedData.currentItems.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
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

              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {t.content}
              </p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleUseTemplate(t.content)}
                  className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-green-600"
                >
                  <Play size={14} /> Sử dụng
                </button>
                <div className="text-sm text-gray-500">
                  <p>{new Date(t.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full py-10">
            {rawData.length === 0
              ? "⏳ Đang tải dữ liệu..."
              : "Không tìm thấy kết quả nào."}
          </p>
        )}
      </div>

      {processedData.totalPages > 1 && (
        <div className="mt-8 flex justify-center pb-8">
          <Paginate
            pageCount={processedData.totalPages}
            onPageChange={(e) => setPage(e.selected + 1)}
          />
        </div>
      )}
    </div>
  );
}
