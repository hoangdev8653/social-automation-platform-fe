import { NavLink } from "react-router-dom";
import { LogOut, Home, PlusSquare, Bot, LayoutTemplate } from "lucide-react";
import { PATH } from "../../utils/path";
import Notification from "../../templates/Notification";
import { getLocalStorage } from "../../utils/localStorage";
import { authStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Header = () => {
  const user = getLocalStorage("user");
  const auth = authStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to={PATH.USER_LAYOUT}
            className="flex items-center shrink-0 text-2xl font-bold text-blue-600"
          >
            {/* Logo */}
            <img src={Logo} alt="Logo" className="w-24  object-contain" />
          </NavLink>

          {/* Center - Nav */}

          <div className="flex items-center space-x-4">
            {/* Notification */}
            <Notification />

            {/* User */}
            <div className="flex gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <a href="/profile">
                <div className="flex flex-col hover:opacity-70">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </p>
                  <span className="text-xs text-gray-500 text-center">
                    {(() => {
                      if (user?.role === "admin") return "Người quản lí";
                      if (user?.role === "user") return "Nhân viên";
                      return user?.role;
                    })()}
                  </span>
                </div>
              </a>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
