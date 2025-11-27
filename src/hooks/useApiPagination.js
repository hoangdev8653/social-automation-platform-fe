import { useState, useEffect, useCallback } from "react";

/**
 * @param {Function} apiCallFunction - Hàm gọi API (nhận vào page, limit)
 * @param {number} itemsPerPage - Số item trên 1 trang
 */
const useApiPagination = (apiCallFunction, itemsPerPage = 10) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi hàm API được truyền vào
        // +1 vì API thường tính trang từ 1, còn ReactPaginate từ 0
        const response = await apiCallFunction(currentPage + 1, itemsPerPage);

        // Giả định API trả về: { data: [...], total: 100 }
        // Bạn cần sửa chỗ này tùy theo cấu trúc API thực tế của bạn
        setData(response.data);
        setPageCount(Math.ceil(response.total / itemsPerPage));
        // Cập nhật để khớp với cấu trúc API: { data: { content: [...], totalElements: ... } }
        const responseData = response?.data || {
          content: [],
          totalElements: 0,
        };
        setData(responseData.content);
        setPageCount(Math.ceil(responseData.totalElements / itemsPerPage));
      } catch (err) {
        setError(err);
        console.error("Lỗi phân trang:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, apiCallFunction]);

  // Hàm xử lý sự kiện click chuyển trang
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return {
    data, // Dữ liệu trang hiện tại
    pageCount, // Tổng số trang
    currentPage, // Trang hiện tại
    handlePageClick, // Hàm truyền xuống UI
    loading, // Trạng thái loading (để hiện spinner)
    error, // Trạng thái lỗi
  };
};

export default useApiPagination;
