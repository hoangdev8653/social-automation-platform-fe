// 👉 Hàm tính thời gian tương đối
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const diff = Math.floor((new Date() - date) / 1000); // tính bằng giây

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};
