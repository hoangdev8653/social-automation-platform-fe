import axios from "axios";
import { BASE_URL_LOCAL } from "./utils/constants";
import {
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
} from "./utils/localStorage";

export const axiosConfig = axios.create({
  baseURL: BASE_URL_LOCAL,
});

// ========================
// Request Interceptor
// ========================
axiosConfig.interceptors.request.use(
  (config) => {
    const accessToken = getLocalStorage("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Refresh Token Logic
// ========================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosConfig.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 thì refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang refresh → chờ refresh xong
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosConfig(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Nếu chưa refresh → gọi API refresh
      isRefreshing = true;

      try {
        // Thêm withCredentials: true để gửi cookie chứa refreshToken
        const res = await axios.post(
          `${BASE_URL_LOCAL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setLocalStorage("accessToken", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;

        return axiosConfig(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearLocalStorage();
        // Chuyển hướng về trang đăng nhập nếu refresh token thất bại
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
