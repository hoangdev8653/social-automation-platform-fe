import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postStore } from "../../store/post";
import { platformStore } from "../../store/platform";
import { socialAccountStore } from "../../store/socialAccount";
import { toast } from "react-toastify";
import { createPostValidate } from "../../validations/post";

export default function CreatePost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const navigate = useNavigate();
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
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
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
      filteredValues.socialAccountIds.forEach((id) => {
        console.log(id);

        formData.append("socialAccountIds", id);
      });
      // formData.append("socialAccountIds", filteredValues.socialAccountIds);
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
      }
      console.log("Kết quả API:", response);
    } catch (error) {
      console.error("Lỗi khi gửi bài đăng:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPlatformNames = selectedPlatforms.map((p) => p.name);
  const filteredAccounts = socialAccount?.data?.content?.filter((account) =>
    selectedPlatformNames.includes(account.platform.name)
  );
  return (
    <div className=" min-h-screen mt-16">
      <Formik
        initialValues={initialValues}
        validationSchema={createPostValidate}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
            {/* Nội dung bài đăng */}
            <div className="mb-6">
              <label htmlFor="caption" className="block font-medium mb-2">
                Nội dung bài đăng
              </label>
              <Field
                as="textarea"
                id="caption"
                name="caption"
                className="w-full border rounded-lg p-3 h-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập nội dung bài đăng..."
              />
              <ErrorMessage
                name="caption"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Nền tảng & Page */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-medium mb-2">Chọn nền tảng</h3>
                {platform?.data?.content?.map((p, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 mb-1 capitalize cursor-pointer hover:opacity-60"
                  >
                    <input
                      className="cursor-pointer"
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
                          className="flex items-center gap-2 cursor-pointer hover:opacity-60"
                        >
                          <Field
                            type="checkbox"
                            name="socialAccountIds"
                            value={account.id}
                          />
                          {account.account_name}
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
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
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
            </div>

            {/* Các tùy chọn khác như Frame, Watermark... */}

            {/* Lựa chọn đăng bài */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Lựa chọn đăng bài</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <Field type="radio" name="postOption" value="now" />
                  <div>
                    <p className="font-medium text-green-700">Đăng ngay</p>
                    <p className="text-gray-500 text-sm">
                      Đăng bài lên các nền tảng đã chọn ngay lập tức
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <Field type="radio" name="postOption" value="schedule" />
                  <div>
                    <p className="font-medium text-blue-700">Lên lịch đăng</p>
                    <p className="text-gray-500 text-sm">
                      Đặt thời gian đăng bài trong tương lai
                    </p>
                  </div>
                </label>
              </div>
              {values.postOption === "schedule" && (
                <div className="mt-4 w-full md:w-1/2">
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
                  <ErrorMessage
                    name="scheduledTime"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="mb-6 w-full md:w-2/3">
              <label htmlFor="hashtags" className="font-medium mb-2 block">
                Hashtags (Tùy chọn)
              </label>
              <Field
                id="hashtags"
                name="hashtags"
                type="text"
                placeholder="#hashtag1 #hashtag2"
                className="border rounded-lg w-full p-2"
              />
              <ErrorMessage
                name="hashtags"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 border-t pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
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
                {values.postOption === "schedule" && <Clock size={18} />}
                {values.postOption === "schedule"
                  ? "Lên lịch đăng"
                  : "Đăng bài"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
