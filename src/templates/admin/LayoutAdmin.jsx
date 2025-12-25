import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function LayoutAdmin() {
  // State quản lý việc đóng mở Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hàm này sẽ được gọi khi bấm nút Menu ở Header
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Hàm này được gọi khi bấm nút X hoặc bấm ra ngoài Overlay ở Sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* QUAN TRỌNG: Truyền hàm toggleSidebar xuống Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar nhận trạng thái để biết khi nào trượt ra */}
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutAdmin;
