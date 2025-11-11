import * as Yup from "yup";

export const createPostValidate = Yup.object().shape({
  caption: Yup.string().required("Nội dung bài đăng không được để trống."),
  socialAccountIds: Yup.array()
    .min(1, "Bạn phải chọn ít nhất một trang để đăng.")
    .required("Bạn phải chọn ít nhất một trang để đăng."),
  hashtags: Yup.string().required("Hashtags bài đăng không được để trống."),
});
