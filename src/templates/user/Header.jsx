import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  PlusSquare,
  Bot,
  LayoutTemplate,
  Menu,
  X,
} from "lucide-react";
import { PATH } from "../../utils/path";
import Notification from "../Notification";
import { getLocalStorage } from "../../utils/localStorage";
import { authStore } from "../../store/auth";
import Logo from "../../assets/logo.png";

const navItems = [
  { to: PATH.USER_LAYOUT, icon: <Home size={18} />, label: "Trang chủ" },
  {
    to: PATH.CREATE_POST,
    icon: <PlusSquare size={18} />,
    label: "Tạo bài đăng",
  },
  { to: PATH.AI_USER, icon: <Bot size={18} />, label: "AI" },
  { to: PATH.TEMPLATE_USER, icon: <LayoutTemplate size={18} />, label: "Mẫu" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = getLocalStorage("user");
  const auth = authStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <NavLink
            to={PATH.USER_LAYOUT}
            className="flex items-center shrink-0 text-2xl font-bold text-blue-600"
          >
            <img src={Logo} alt="Logo" className="w-24 object-contain" />
          </NavLink>

          {/* Center - Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === PATH.USER_LAYOUT}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Notification />

            <a href="/profile" className="flex items-center gap-2">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`}
                alt="avatar"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
              />
              <div className="hidden lg:flex flex-col hover:opacity-70">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <span className="text-xs text-gray-500">
                  {user?.role === "admin"
                    ? "Người quản lí"
                    : user?.role === "user"
                    ? "Nhân viên"
                    : user?.role}
                </span>
              </div>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition"
            >
              <LogOut size={16} />
              {/* Thay đổi: Ẩn chữ Đăng xuất ở màn hình md */}
              <span className="hidden lg:inline">Đăng Xuất</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Notification />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          {/* User Info */}
          <a href="/profile" className="flex items-center gap-3 mb-4">
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <span className="text-sm text-gray-500">
                {user?.role === "admin"
                  ? "Người quản lí"
                  : user?.role === "user"
                  ? "Nhân viên"
                  : user?.role}
              </span>
            </div>
          </a>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === PATH.USER_LAYOUT}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-6 rounded-lg font-medium transition"
          >
            <LogOut size={16} />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
