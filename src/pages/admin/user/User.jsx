import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Edit,
  KeyRound,
  Trash2,
  Search,
  Lock,
  Unlock,
  Mail,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import AddUser from "./AddUser";
import UpdateRole from "./UpdateRole";
import { userStore } from "../../../store/user";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { toast } from "react-toastify";

export default function User() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Xác nhận",
    confirmButtonClass: "bg-red-600 hover:bg-red-700",
  });

  const user = userStore();

  useEffect(() => {
    const fetchData = async () => {
      await user.getAllUser();
    };
    fetchData();
  }, []);

  // Lọc và tìm kiếm
  const filteredUsers = user.data?.data?.filter((emp) => {
    const matchesRole =
      roleFilter === "all" ||
      emp.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  // Stats calculation
  const newUsersThisMonth =
    user.data?.data?.filter((u) => {
      const userCreationDate = new Date(u.createdAt);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return (
        userCreationDate.getMonth() === currentMonth &&
        userCreationDate.getFullYear() === currentYear
      );
    }).length || 0;

  // Handlers
  const handleResetPassword = async (id) => {
    setConfirmation({
      isOpen: true,
      title: "Xác nhận Đặt lại Mật khẩu",
      message:
        "Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này không? Mật khẩu mới sẽ là '123456'.",
      onConfirm: async () => {
        const response = await user.resetPassword(id);
        if (response.status == 200) {
          toast.success("Đặt lại mật khẩu thành công! Mật khẩu mới là: 123456");
        }
        closeConfirmation();
      },
      confirmText: "Đặt lại",
      confirmButtonClass: "bg-yellow-500 hover:bg-yellow-600",
    });
  };

  const handleLockAccount = async (id) => {
    setConfirmation({
      isOpen: true,
      title: "Xác nhận Khóa/Mở khóa",
      message: "Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này không?",
      onConfirm: async () => {
        const response = await user.lockAccount(id);
        if (response.status == 200) {
          toast.success("Bạn đã thay đổi trạng thái tài khoản thành công!");
          await user.getAllUser();
        }
        closeConfirmation();
      },
      confirmText: "Xác nhận",
      confirmButtonClass: "bg-gray-500 hover:bg-gray-600",
    });
  };

  const handleDeleteAccount = async (id) => {
    setConfirmation({
      isOpen: true,
      title: "Xác nhận Xóa Tài khoản",
      message:
        "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa tài khoản này không?",
      onConfirm: async () => {
        await user.deleteUserById(id);
        closeConfirmation();
      },
      confirmText: "Xóa",
      confirmButtonClass: "bg-red-600 hover:bg-red-700",
    });
  };

  const closeConfirmation = () =>
    setConfirmation({ ...confirmation, isOpen: false });

  // Render Component Helpers
  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "blocked"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "active"
        ? "Hoạt động"
        : status === "blocked"
        ? "Tạm khóa"
        : status}
    </span>
  );

  const RoleBadge = ({ role }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        role === "admin"
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );

  const ActionButtons = ({ emp }) => (
    <div className="flex gap-2">
      <button
        title="Chỉnh sửa vai trò"
        onClick={() => setEditingUser(emp)}
        className="p-2 hover:bg-blue-50 bg-gray-50 rounded-lg text-blue-600 transition"
      >
        <Edit size={18} />
      </button>
      <button
        title="Đặt lại mật khẩu"
        onClick={() => handleResetPassword(emp.id)}
        className="p-2 hover:bg-yellow-50 bg-gray-50 rounded-lg text-yellow-600 transition"
      >
        <KeyRound size={18} />
      </button>
      <button
        title={
          emp.status === "blocked" ? "Mở khóa tài khoản" : "Khóa tài khoản"
        }
        onClick={() => handleLockAccount(emp.id)}
        className="p-2 hover:bg-gray-200 bg-gray-50 rounded-lg text-gray-600 transition"
      >
        {emp.status === "blocked" ? <Unlock size={18} /> : <Lock size={18} />}
      </button>
      <button
        title="Xóa nhân viên"
        onClick={() => handleDeleteAccount(emp.id)}
        className="p-2 hover:bg-red-50 bg-gray-50 rounded-lg text-red-600 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      <div className="space-y-6  px-4 sm:px-0 pb-20 sm:pb-0">
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý nhân viên
          </h1>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm shadow-blue-200 transition"
          >
            <UserPlus size={18} /> <span>Thêm nhân viên</span>
          </button>
        </div>

        {/* --- STATS (Grid Responsive) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Tổng nhân viên
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.data?.data?.length || 0}
              </h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Đang hoạt động
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.data?.data?.filter((user) => user.status === "active")
                  .length || 0}
              </h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
              <UserPlus size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Mới trong tháng
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {newUsersThisMonth}
              </h2>
            </div>
          </div>
        </div>

        {/* --- FILTERS (Flex wrap) --- */}
        <div className="bg-white border-gray-100 p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 pl-10 w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto border rounded-xl px-4 py-2.5 bg-white border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none cursor-pointer"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* --- DATA DISPLAY --- */}

        {/* 1. TABLE VIEW (Desktop - Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4 pl-6">Nhân viên</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <img
                          src={`https://i.pravatar.cc/150?u=${emp.email}`}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                        <div className="font-medium text-gray-800">
                          {emp.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <RoleBadge role={emp.role} />
                      </td>
                      <td className="p-4 text-gray-600 text-sm">{emp.email}</td>
                      <td className="p-4">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="p-4 flex justify-center">
                        <ActionButtons emp={emp} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400">
                      Không tìm thấy kết quả nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. CARD VIEW (Mobile - Hidden on Desktop) */}
        <div className="md:hidden space-y-4">
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((emp) => (
              <div
                key={emp.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4"
              >
                {/* Card Header: Avatar, Name, Role */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/150?u=${emp.email}`}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{emp.name}</h3>
                      <RoleBadge role={emp.role} />
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                {/* Card Body: Info */}
                <div className="flex flex-col gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-gray-400" />
                    <span>
                      ID:{" "}
                      <span className="font-mono text-xs">
                        {emp.id.substring(0, 8)}...
                      </span>
                    </span>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">
                    Thao tác
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingUser(emp)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleResetPassword(emp.id)}
                      className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"
                    >
                      <KeyRound size={18} />
                    </button>
                    <button
                      title={
                        emp.status === "blocked"
                          ? "Mở khóa tài khoản"
                          : "Khóa tài khoản"
                      }
                      onClick={() => handleLockAccount(emp.id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg"
                    >
                      {emp.status === "blocked" ? (
                        <Unlock size={18} />
                      ) : (
                        <Lock size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(emp.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
              Không tìm thấy nhân viên nào.
            </div>
          )}
        </div>
      </div>

      {/* Modals giữ nguyên */}
      {isAddUserOpen && <AddUser onClose={() => setIsAddUserOpen(false)} />}
      {editingUser && (
        <UpdateRole
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedData) => {
            setEditingUser(null);
          }}
        />
      )}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={confirmation.onConfirm}
        onClose={closeConfirmation}
        confirmText={confirmation.confirmText}
        confirmButtonClass={confirmation.confirmButtonClass}
      />
    </>
  );
}
