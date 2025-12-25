import React, { useState, useEffect } from "react";
import { X, Clock, Hash, Image as ImageIcon, CheckCircle } from "lucide-react";
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
    try {
      const { postOption, scheduledTime, ...filteredValues } = values;

      const formData = new FormData();
      formData.append("caption", filteredValues.caption);
      formData.append("hashtags", filteredValues.hashtags);

      if (postOption === "schedule" && scheduledTime) {
        // Chuyển đổi giờ địa phương sang chuẩn ISO 8601 (UTC)
        // Ví dụ: Nhập 23:10 ở VN (+7) -> Gửi lên 16:10Z (UTC)
        const isoTime = new Date(scheduledTime).toISOString();
        formData.append("scheduledTime", isoTime);
        console.log(isoTime);
      }

      filteredValues.socialAccountIds.forEach((id) => {
        formData.append("socialAccountIds", id);
      });

      if (filteredValues.files && filteredValues.files.length > 0) {
        filteredValues.files.forEach((file) => {
          if (file instanceof File) {
            formData.append("files", file);
          } else {
            console.warn("Không phải file hợp lệ:", file);
          }
        });
      }

      const response = await post.createPost(formData);
      if (response?.status === 201) {
        toast.success("Bài viết đã ở trạng thái chờ duyệt từ quản trị viên.");
        resetForm();
        setSelectedPlatforms([]);
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài đăng:", error);
      toast.error("Tạo bài đăng thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedPlatformNames = selectedPlatforms.map((p) => p.name);
  const filteredAccounts = socialAccount?.data?.content?.filter((account) =>
    selectedPlatformNames.includes(account.platform.name)
  );

  return (
    // 1. Thêm p-4 để modal cách lề trên mobile
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* 2. Responsive width: w-full max-w-4xl (thay vì w-[850px]) */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header - Sticky top */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 bg-white shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Thêm bài đăng mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Formik
            initialValues={initialValues}
            validationSchema={createPostValidate}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, setFieldValue }) => (
              <Form className="flex flex-col gap-6">
                {/* --- CONTENT --- */}
                <div>
                  <label
                    htmlFor="caption"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Nội dung bài đăng <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="caption"
                    name="caption"
                    className="w-full border border-gray-300 rounded-xl p-4 h-40 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition resize-none text-base"
                    placeholder="Bạn đang nghĩ gì thế?..."
                  />
                  <ErrorMessage
                    name="caption"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* --- PLATFORM & PAGE SELECTION --- */}
                {/* Mobile: 1 cột (dọc), Desktop: 2 cột (ngang) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {/* Cột 1: Chọn Nền tảng */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      1. Chọn nền tảng
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {platform?.data?.content?.map((p) => {
                        const isSelected = selectedPlatforms.some(
                          (sp) => sp.id === p.id
                        );
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition select-none ${
                              isSelected
                                ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                                : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => togglePlatform(p)}
                            />
                            {isSelected && (
                              <CheckCircle
                                size={14}
                                className="text-blue-600"
                              />
                            )}
                            <span className="capitalize text-sm font-medium">
                              {p.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cột 2: Chọn Page (Account) */}
                  <div className="md:border-l md:border-gray-200 md:pl-6 border-t border-gray-200 pt-4 md:pt-0 md:border-t-0">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      2. Chọn Page đích
                    </h3>
                    {selectedPlatforms.length === 0 ? (
                      <div className="text-gray-400 text-sm italic py-2">
                        ← Hãy chọn nền tảng trước
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredAccounts?.length > 0 ? (
                          filteredAccounts.map((account) => (
                            <label
                              key={account.id}
                              className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition group"
                            >
                              <Field
                                type="checkbox"
                                name="socialAccountIds"
                                value={String(account.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                {account.account_name}
                              </span>
                              <span className="text-xs text-gray-400 border px-1.5 rounded bg-white">
                                {account.platform.name}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                            Chưa kết nối tài khoản nào cho nền tảng này.
                          </p>
                        )}
                      </div>
                    )}
                    <ErrorMessage
                      name="socialAccountIds"
                      component="div"
                      className="text-red-500 text-sm mt-2 font-medium"
                    />
                  </div>
                </div>

                {/* --- MEDIA UPLOAD --- */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <ImageIcon size={18} className="text-gray-500" /> Hình ảnh &
                    Video
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-blue-400 transition cursor-pointer relative">
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
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-2">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Kéo thả hoặc click để tải lên
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Hỗ trợ: JPG, PNG, MP4
                      </p>
                      {values.files && values.files.length > 0 && (
                        <div className="mt-3 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                          Đã chọn {values.files.length} file
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- SCHEDULING OPTIONS --- */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Tùy chọn đăng
                  </h3>
                  <div className="space-y-3">
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        values.postOption === "now"
                          ? "bg-white border-blue-500 shadow-sm"
                          : "hover:bg-white border-gray-200"
                      }`}
                    >
                      <Field
                        type="radio"
                        name="postOption"
                        value="now"
                        className="mt-1 accent-blue-600"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          Đăng ngay
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          Bài viết sẽ được đưa vào hàng chờ duyệt và đăng ngay
                          sau đó.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        values.postOption === "schedule"
                          ? "bg-white border-blue-500 shadow-sm"
                          : "hover:bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Field
                          type="radio"
                          name="postOption"
                          value="schedule"
                          className="mt-1 accent-blue-600"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            Lên lịch đăng
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Chọn ngày giờ cụ thể để đăng bài.
                          </p>
                        </div>
                      </div>

                      {/* DateTime Picker - Hiển thị khi chọn Schedule */}
                      {values.postOption === "schedule" && (
                        <div className="mt-3 sm:mt-0 sm:ml-auto w-full sm:w-auto animate-in fade-in slide-in-from-top-1">
                          <Field
                            name="scheduledTime"
                            type="datetime-local"
                            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* --- HASHTAGS --- */}
                {/* Mobile: w-full, Desktop: w-full (giữ full width cho đẹp) */}
                <div>
                  <label
                    htmlFor="hashtags"
                    className="font-semibold text-gray-800 mb-2 flex items-center gap-2"
                  >
                    <Hash size={16} className="text-gray-500" /> Hashtags (Tùy
                    chọn)
                  </label>
                  <Field
                    id="hashtags"
                    name="hashtags"
                    type="text"
                    placeholder="#marketing #social #trend..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* --- FOOTER BUTTONS --- */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition ${
                      values.postOption === "schedule"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      "Đang xử lý..."
                    ) : (
                      <>
                        {values.postOption === "schedule" ? (
                          <Clock size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                        {values.postOption === "schedule"
                          ? "Lên lịch bài đăng"
                          : "Tạo bài đăng"}
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
