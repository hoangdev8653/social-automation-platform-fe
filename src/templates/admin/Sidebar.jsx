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
} from "lucide-react";
import { PATH } from "../../utils/path";

const sidebarNavItems = [
  {
    to: PATH.DASHBOARD,
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
  },
  {
    to: PATH.AI_ADMIN,
    icon: <Bot size={20} />,
    label: "AI",
  },
  {
    to: PATH.ANALYTIC,
    icon: <BarChart2 size={20} />,
    label: "Phân tích",
  },
  {
    to: PATH.USER,
    icon: <Users size={20} />,
    label: "Quản lý nhân viên",
  },
  {
    to: PATH.PAGE,
    icon: <FileText size={20} />,
    label: "Quản lý page",
  },
  {
    to: PATH.MEDIA,
    icon: <Image size={20} />,
    label: "Media",
  },
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

const Sidebar = () => {
  const activeLinkClass = "bg-blue-500 text-white";
  const inactiveLinkClass =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 mt-16">
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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
  );
};

export default Sidebar;
