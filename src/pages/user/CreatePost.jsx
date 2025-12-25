import React, { useState, useEffect } from "react";
import { Clock, Hash, Image as ImageIcon, CheckCircle } from "lucide-react"; // Đã bỏ icon X
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postStore } from "../../store/post";
import { platformStore } from "../../store/platform";
import { socialAccountStore } from "../../store/socialAccount";
import { toast } from "react-toastify";
import { createPostValidate } from "../../validations/post";

export default function CreatePost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const post = postStore();
  const platform = platformStore();
  const socialAccount = socialAccountStore();

  useEffect(() => {
    const fetchData = async () => {
      await platform.getAllPlatform();
      await socialAccount.getAllSocialAccount();
    };
    fetchData();
  }, []);

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
        const isoTime = new Date(scheduledTime).toISOString();
        formData.append("scheduledTime", isoTime);
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
        // Không còn gọi onClose() nữa
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài đăng:", error);
      toast.error("Tạo bài đăng thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPlatformNames = selectedPlatforms.map((p) => p.name);
  const filteredAccounts = socialAccount?.data?.content?.filter((account) =>
    selectedPlatformNames.includes(account.platform.name)
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 mt-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        {/* Header */}
        <div className="flex justify-center items-center p-6 border-b border-gray-100 bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Thêm bài đăng mới
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Tạo nội dung và đăng tải lên nhiều nền tảng cùng lúc
            </p>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={createPostValidate}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, setFieldValue }) => (
              <Form className="flex flex-col gap-8">
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
                    className="w-full border border-gray-300 rounded-xl p-4 h-40 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition resize-none text-base shadow-sm"
                    placeholder="Bạn đang nghĩ gì thế?..."
                  />
                  <ErrorMessage
                    name="caption"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* --- PLATFORM & PAGE SELECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  {/* Cột 1: Chọn Nền tảng */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      Chọn nền tảng
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {platform?.data?.content?.map((p) => {
                        const isSelected = selectedPlatforms.some(
                          (sp) => sp.id === p.id
                        );
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition select-none shadow-sm ${
                              isSelected
                                ? "bg-white border-blue-500 text-blue-700 ring-1 ring-blue-500"
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
                                size={16}
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
                  <div className="lg:border-l lg:border-gray-200 lg:pl-8 border-t border-gray-200 pt-6 lg:pt-0 lg:border-t-0">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      Chọn Page đích
                    </h3>
                    {selectedPlatforms.length === 0 ? (
                      <div className="text-gray-400 text-sm italic py-2 bg-white px-4 rounded border border-dashed border-gray-300 text-center">
                        Vui lòng chọn nền tảng ở bước 1 trước
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredAccounts?.length > 0 ? (
                          filteredAccounts.map((account) => (
                            <label
                              key={account.id}
                              className="flex items-center gap-3 p-3 bg-white border border-gray-200 hover:border-blue-300 rounded-lg cursor-pointer transition group shadow-sm"
                            >
                              <Field
                                type="checkbox"
                                name="socialAccountIds"
                                value={String(account.id)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-800 font-semibold">
                                  {account.account_name}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  {account.platform.name}
                                </span>
                              </div>
                            </label>
                          ))
                        ) : (
                          <p className="text-orange-600 text-sm bg-orange-50 p-3 rounded-lg border border-orange-100">
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
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <ImageIcon size={20} className="text-gray-500" /> Hình ảnh &
                    Video
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-400 transition cursor-pointer relative group">
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
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon size={32} />
                      </div>
                      <p className="text-base font-medium text-gray-700">
                        Kéo thả file vào đây hoặc click để tải lên
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Hỗ trợ: JPG, PNG, MP4 (Tối đa 50MB)
                      </p>
                      {values.files && values.files.length > 0 && (
                        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                          <span className="text-sm font-semibold bg-green-100 text-green-700 px-4 py-1.5 rounded-full border border-green-200">
                            Đã chọn {values.files.length} file
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- SCHEDULING & HASHTAGS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Hashtags */}
                  <div>
                    <label
                      htmlFor="hashtags"
                      className="font-semibold text-gray-800 mb-2 flex items-center gap-2"
                    >
                      <Hash size={18} className="text-gray-500" /> Hashtags
                    </label>
                    <Field
                      id="hashtags"
                      name="hashtags"
                      type="text"
                      placeholder="#marketing #social #trend..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition shadow-sm"
                    />
                  </div>

                  {/* Scheduling Options */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Tùy chọn đăng
                    </h3>
                    <div className="space-y-3">
                      <label
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          values.postOption === "now"
                            ? "bg-white border-blue-500 shadow-sm"
                            : "bg-transparent border-transparent hover:bg-white hover:border-gray-300"
                        }`}
                      >
                        <Field
                          type="radio"
                          name="postOption"
                          value="now"
                          className="mt-1 accent-blue-600 w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            Đăng ngay
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex flex-col gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          values.postOption === "schedule"
                            ? "bg-white border-blue-500 shadow-sm"
                            : "bg-transparent border-transparent hover:bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Field
                            type="radio"
                            name="postOption"
                            value="schedule"
                            className="mt-1 accent-blue-600 w-4 h-4"
                          />
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              Lên lịch đăng
                            </p>
                          </div>
                        </div>
                        {values.postOption === "schedule" && (
                          <div className="ml-7 w-full sm:w-auto">
                            <Field
                              name="scheduledTime"
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                            />
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* --- FOOTER BUTTONS --- */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition transform active:scale-95 ${
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
                          <Clock size={20} />
                        ) : (
                          <CheckCircle size={20} />
                        )}
                        {values.postOption === "schedule"
                          ? "Lên lịch bài đăng"
                          : "Đăng bài viết"}
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
