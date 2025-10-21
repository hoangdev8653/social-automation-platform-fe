import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  UsersRound,
  Edit,
  KeyRound,
  Trash2,
  Search,
  Lock,
} from "lucide-react";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import { userStore } from "../../../store/user";

export default function User() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const user = userStore();

  useEffect(() => {
    const fetchData = async () => {
      await user.getAllUser();
    };
    fetchData();
  }, []);

  console.log("user.users", user.data);

  const handleResetPassword = async (id) => {
    alert("Bạn chắc chắn muốn reset password chứ!");
  };

  const handleLockAccount = async (id) => {
    alert("Bạn chắc chắn muốn khóa tài khoản chứ!");
  };

  const handleDeleteAccount = async (id) => {
    alert("Bạn chắc chắn muốn xóa tài khoản chứ!");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý nhân viên
          </h1>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
              <UsersRound size={16} /> Quản lý Vai trò
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
              <Download size={16} /> Export
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
              <Upload size={16} /> Import
            </button>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <UserPlus size={16} /> Thêm nhân viên
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng nhân viên</p>
              <h2 className="text-2xl font-bold">
                {user.data?.data?.length || 0}
              </h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <h2 className="text-2xl font-bold">
                {user.data?.data?.length || 0}
              </h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mới trong tháng</p>
              <h2 className="text-2xl font-bold">2</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-gray-100 p-4 rounded-xl shadow-sm border flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            className="border border-gray-200 rounded-lg  px-3 py-2 pl-10 w-full focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
        <select className="border rounded-lg px-3 py-2 bg-white border-gray-100">
          <option>Tất cả vai trò</option>
          <option>Admin</option>
          <option>User</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto mt-4">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Nhân viên</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Email</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {user?.data?.data && user?.data?.data?.length > 0 ? (
              user.data.data.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/50?u=${emp.email}`}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{emp.name}</p>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        emp.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{emp.email}</td>
                  <td className="p-4 text-gray-600">
                    {emp?.status === "active"
                      ? "Hoạt động"
                      : emp?.status === "blocked"
                      ? "Tạm khóa"
                      : emp?.status}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setEditingUser(emp)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleResetPassword(emp.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <KeyRound size={16} className="text-yellow-600" />
                    </button>
                    <button
                      onClick={() => handleLockAccount(emp.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Lock size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(emp.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 italic"
                >
                  Không có dữ liệu người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isAddUserOpen && <AddUser onClose={() => setIsAddUserOpen(false)} />}
      {editingUser && (
        <UpdateUser
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedData) => {
            console.log("Lưu dữ liệu đã cập nhật:", updatedData);
            setEditingUser(null);
          }}
        />
      )}
    </>
  );
}
