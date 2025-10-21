import { Lock, Mail } from "lucide-react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { loginValidate } from "../validations/auth";
import { authStore } from "../store/auth";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate(); // 2. Khởi tạo hàm navigate
  const auth = authStore();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidate,
    onSubmit: async (values) => {
      const response = await auth.login(values);
      if (response.status == 200) {
        toast.success("Đăng nhập thành công");
        setTimeout(() => {
          if (response.data.content.role === "admin") {
            navigate("/dashboard/"); 
          } else {
            navigate("/"); 
          }
        }, 3000);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
          <p className="text-gray-500 text-sm mt-1">
            Vui lòng nhập thông tin tài khoản để tiếp tục
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nhập email của bạn"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nhập mật khẩu"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Ghi nhớ và Quên mật khẩu */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="text-indigo-600 rounded" />
              <span className="text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-indigo-600 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        {/* Đăng ký */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
