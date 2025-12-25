import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  BarChart2,
  ClipboardList,
  Users,
  LayoutTemplate,
  FileText,
  Image,
  X, // Thêm icon X để đóng menu trên mobile
} from "lucide-react";
import { PATH } from "../../utils/path";

const sidebarNavItems = [
  {
    to: PATH.DASHBOARD,
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
  },
  { to: PATH.AI_ADMIN, icon: <Bot size={20} />, label: "AI" },
  { to: PATH.ANALYTIC, icon: <BarChart2 size={20} />, label: "Phân tích" },
  { to: PATH.USER, icon: <Users size={20} />, label: "Quản lý nhân viên" },
  { to: PATH.PAGE, icon: <FileText size={20} />, label: "Quản lý page" },
  { to: PATH.MEDIA, icon: <Image size={20} />, label: "Media" },
  {
    to: PATH.POST,
    icon: <ClipboardList size={20} />,
    label: "Quản lý bài viết",
  },
  {
    to: PATH.TEMPLATE_ADMIN,
    icon: <LayoutTemplate size={20} />,
    label: "Template",
  },
];

// Nhận props isOpen và closeSidebar từ LayoutAdmin
const Sidebar = ({ isOpen, closeSidebar }) => {
  const activeLinkClass = "bg-blue-500 text-white shadow-md";
  const inactiveLinkClass =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <>
      {/* 1. OVERLAY (Lớp nền tối): Chỉ hiện trên mobile khi menu mở */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={closeSidebar}
        ></div>
      )}

      {/* 2. SIDEBAR CHÍNH */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        // Bỏ mt-16 vì Layout đã có pt-16, và trên mobile sidebar cần full chiều cao
      >
        {/* Header của Sidebar trên Mobile (Nút đóng) */}
        <div className="flex justify-between items-center p-4 lg:hidden border-b">
          <span className="font-bold text-lg text-gray-800">Menu</span>
          <button
            onClick={closeSidebar}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X size={24} />
          </button>
        </div>

        {/* Danh sách Menu */}
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end
                onClick={closeSidebar} // Tự động đóng menu khi chọn item trên mobile
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? activeLinkClass : inactiveLinkClass
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
