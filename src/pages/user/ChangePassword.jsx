import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, KeyRound, Eye, EyeOff } from "lucide-react";
import { userStore } from "../../store/user"; // Giả sử userStore đã được import
import { updatePasswordValidate } from "../../validations/auth";
import Notification from "../../utils/notification";

export default function ChangePassword({ isOpen, onClose }) {
  const user = userStore();

  // State để quản lý việc hiển thị mật khẩu
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Gọi API để thay đổi mật khẩu
      const response = await user.updatePassword({
        password: values.password,
        newPassword: values.newPassword,
      });
      if (response.status === 200) {
        Notification("success", "Đổi mật khẩu thành công!");
        onClose();
        resetForm();
      } else {
        Notification(
          "error",
          response.data?.message || "Đổi mật khẩu thất bại."
        );
      }
    } catch (error) {
      Notification(
        "error",
        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Đổi mật khẩu</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        <Formik
          initialValues={{
            password: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={updatePasswordValidate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Mật khẩu cũ */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Mật khẩu cũ
                </label>
                <div className="relative">
                  <Field
                    type={showOldPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  <KeyRound size={16} />
                  Lưu mật khẩu
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
