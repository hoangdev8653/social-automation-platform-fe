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

axiosConfig.interceptors.request.use(
  function (config) {
    const accessToken = getLocalStorage("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    console.log(error.message);
    return Promise.reject(error);
  }
);
axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getLocalStorage("refreshToken");
        if (!refreshToken) {
          console.error("Refresh token is missing");
          return Promise.reject(error);
        }
        const response = await axios.post(
          "http://localhost:3007/user/refresh-token",
          {
            refreshToken,
          }
        );
        const accessToken = response.data.newToken.accessToken;
        if (!accessToken) {
          console.error("accessToken token is missing");
          return Promise.reject(error);
        }
        setLocalStorage("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        console.log(error.message);
        clearLocalStorage();
      }
    }

    return Promise.reject(error);
  }
);
