import React, { useState, useEffect } from "react";
import { X, Clock, Hash } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postStore } from "../../../store/post";
import { platformStore } from "../../../store/platform";
import { socialAccountStore } from "../../../store/socialAccount";
import { toast } from "react-toastify";
import { createPostValidate } from "../../../validations/post";

export default function AddPost({ isOpen, onClose }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const post = postStore();
  const platform = platformStore();
  const socialAccount = socialAccountStore();

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        await platform.getAllPlatform();
        await socialAccount.getAllSocialAccount();
      };
      fetchData();
    }
  }, [isOpen]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.some((p) => p.id === platform.id)
        ? prev.filter((p) => p.id !== platform.id)
        : [...prev, platform]
    );
  };

  const initialValues = {
    caption: "",
    hashtags: "",
    socialAccountIds: [],
    files: [],
    postOption: "now",
    scheduledTime: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Logic xử lý gửi bài đăng tương tự CreatePost.jsx
    // ... (sẽ được thêm vào trong phần Formik)
    console.log("Submitting", values);
    toast.success("Bắt đầu quá trình tạo bài đăng!");
    onClose(); // Đóng modal sau khi submit
    resetForm();
    setSubmitting(false);
  };

  if (!isOpen) return null;

  const selectedPlatformNames = selectedPlatforms.map((p) => p.name);
  const filteredAccounts = socialAccount?.data?.content?.filter((account) =>
    selectedPlatformNames.includes(account.platform.name)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[850px] max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thêm bài đăng mới</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={createPostValidate}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              {/* Nội dung bài đăng */}
              <div className="mb-4">
                <label htmlFor="caption" className="block font-medium mb-2">
                  Nội dung bài đăng
                </label>
                <Field
                  as="textarea"
                  id="caption"
                  name="caption"
                  className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập nội dung bài đăng..."
                />
                <ErrorMessage
                  name="caption"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                <button
                  type="button"
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  AI tạo nội dung
                </button>
              </div>

              {/* Nền tảng & Page */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Chọn nền tảng</h3>
                  {platform?.data?.content?.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 mb-1 capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.some((sp) => sp.id === p.id)}
                        onChange={() => togglePlatform(p)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Chọn Page</h3>
                  {selectedPlatforms.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Vui lòng chọn nền tảng trước
                    </p>
                  ) : (
                    <div className="space-y-2" role="group">
                      {filteredAccounts?.length > 0 ? (
                        filteredAccounts.map((account) => (
                          <label
                            key={account.id}
                            className="flex items-center gap-2"
                          >
                            <Field
                              type="checkbox"
                              name="socialAccountIds"
                              value={String(account.id)}
                            />
                            {account.account_name}{" "}
                            <span className="text-gray-500 text-sm">
                              ({account.platform.name})
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Không có page nào cho nền tảng này.
                        </p>
                      )}
                    </div>
                  )}
                  <ErrorMessage
                    name="socialAccountIds"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Ảnh & Video */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Hình ảnh & Video</h3>
                <input
                  id="files"
                  name="files"
                  type="file"
                  multiple
                  onChange={(event) => {
                    setFieldValue(
                      "files",
                      Array.from(event.currentTarget.files)
                    );
                  }}
                  className="border rounded-lg w-full p-2"
                />
              </div>

              {/* Lựa chọn đăng bài */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Lựa chọn đăng bài</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <Field type="radio" name="postOption" value="now" />
                    <div>
                      <p className="font-medium text-green-700">Đăng ngay</p>
                      <p className="text-gray-500 text-sm">
                        Bài viết sẽ được gửi để chờ duyệt và đăng ngay sau khi
                        được duyệt.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <Field type="radio" name="postOption" value="schedule" />
                    <div>
                      <p className="font-medium text-blue-700">Lên lịch đăng</p>
                      <p className="text-gray-500 text-sm">
                        Đặt thời gian đăng bài trong tương lai.
                      </p>
                    </div>
                  </label>
                </div>
                {values.postOption === "schedule" && (
                  <div className="mt-4 w-1/3">
                    <label
                      htmlFor="scheduledTime"
                      className="block text-sm mb-1 font-medium"
                    >
                      Thời gian đăng
                    </label>
                    <Field
                      id="scheduledTime"
                      name="scheduledTime"
                      type="datetime-local"
                      className="border rounded-lg w-full p-2"
                    />
                  </div>
                )}
              </div>

              {/* Hashtags */}
              <div className="mb-6 w-1/2">
                <h3 className="font-medium mb-2">Hashtags (Tùy chọn)</h3>
                <Field
                  id="hashtags"
                  name="hashtags"
                  type="text"
                  placeholder="#hashtag1 #hashtag2"
                  className="border rounded-lg w-full p-2"
                />
                <button
                  type="button"
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Hash size={18} /> AI tạo hashtags
                </button>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-4">
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
                  className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                    values.postOption === "schedule"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } disabled:opacity-50`}
                >
                  {values.postOption === "schedule" ? (
                    <Clock size={18} />
                  ) : null}
                  {values.postOption === "schedule"
                    ? "Lên lịch đăng"
                    : "Tạo bài đăng"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
