import { login, logout, refreshToken, register } from "../apis/auth";
import { create } from "zustand";
import {
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
} from "../utils/localStorage";

export const authStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  register: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await register(data);
      set({ loading: false, data: response.data });
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },

  login: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await login(data);
      set({ loading: false, data: response.data });
      setLocalStorage("user", response.data.content);
      setLocalStorage("accessToken", response.data.accessToken);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.";
      set({ loading: false, error: errorMessage });
      // Ném lỗi ra ngoài để component có thể bắt và xử lý
      throw new Error(errorMessage);
    }
  },
  logout: async () => {
    try {
      clearLocalStorage();
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },
}));
