import { IoPersonOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import Facebook from "../assets/fb_logo-512x512.png";
import Google from "../assets/google-search-3.png";
import { useFormik } from "formik";
import { loginValidate } from "../validations/auth";
import { useNavigate } from "react-router-dom";
import {} from "../store/";
function Login() {
  const Navigate = useNavigate();
  const { user, login } = userStore();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidate,
    onSubmit: async (values) => {
      try {
        const { role, error } = await login(values);
        if (error) {
          console.log("Đăng nhập không thành công:", error);
        } else if (role) {
          setTimeout(() => {
            if (role === "admin") {
              Navigate("/dashboard/product");
            } else {
              Navigate("/");
            }
          }, 3000);
        }
      } catch (error) {
        console.log("Đăng nhập không thành công:", error);
      }
    },
  });

  return (
    <div
      style={{
        backgroundImage:
          "url(https://colorlib.com/etc/lf/Login_v4/images/bg-01.jpg)",
      }}
      className="max-w-[100%] min-h-screen flex flex-wrap justify-center items-center p-[15px] bg-no-repeat bg-center bg-cover"
    >
      <div className="w-[500px] bg-white rounded-xl overflow-hidden px-[20px] py-[30px]">
        <form onSubmit={formik.handleSubmit} className="w-full">
          <span className="block text-[39px]   text-center pb-[12px]">
            Login
          </span>
          <div className="relative w-full border-b-2 border-solid  mb-[12px]">
            <span className="text-base text-gray-600 pl-[7px] font-medium">
              Email:
            </span>
            <p className="flex">
              <IoPersonOutline className="text-2xl mt-[12px] mx-2" />
              <input
                className="w-full"
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </p>
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 mb-2 text-center">
              {formik.errors.email}
            </div>
          )}
          <div className="relative w-full border-b-2 border-solid mb-[12px]">
            <span className="text-base text-gray-600 pl-[7px] font-medium">
              Password:
            </span>
            <p className="flex">
              <CiLock className="text-2xl mt-[12px] mx-2" />
              <input
                className="w-full"
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </p>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 mb-2 text-center">
              {formik.errors.password}
            </div>
          )}
          <a href="forgot-password">
            <p className="text-right hover:text-blue-600 cursor-pointer text-gray-600">
              Forgot Password?
            </p>
          </a>
          <button
            type="submit"
            className="text-white font-medium bg-blue-800 w-full text-xl my-6 px-4 py-3 rounded-2xl hover:opacity-80"
          >
            LOGIN
          </button>
          <p className="text-center mx-auto text-gray-500">Or Sign Up Using </p>
          <div className="flex text-center items-center justify-center gap-6 my-2">
            <img
              className="w-[40px] h-[40px] rounded-3xl hover:opacity-60 cursor-pointer"
              src={Facebook}
              alt="facebook"
            />
            <img
              className="w-[40px] h-[40px] rounded-3xl hover:opacity-60 cursor-pointer"
              src={Google}
              alt="google"
            />
          </div>
          <a
            href="/register"
            className="text-gray-500 hover:text-blue-600 text-base cursor-pointer "
          >
            <p className="text-center mt-4">Sign Up</p>
          </a>
        </form>
      </div>
    </div>
  );
}

export default Login;
