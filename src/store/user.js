import { create } from "zustand";
import {
  changePassword,
  deleteUserById,
  getAllUser,
  getUserById,
  updateUserById,
  lockAccount,
  resetPassword,
} from "../apis/user";

export const userStore = create((set, get) => ({
  data: [],
  currentUser: null,
  error: null,
  loading: false,

  getAllUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllUser();
      set({ data: response.data, loading: false });
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getUserById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getUserById(id);
      set({ currentUser: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  updateUserById: async (id, userData) => {
    try {
      set({ loading: true, error: null });
      await updateUserById(id, userData);
      await get().getAllUser(); // Tải lại danh sách người dùng sau khi cập nhật
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  changePassword: async (id, passwordData) => {
    try {
      set({ loading: true, error: null });
      await changePassword(id, passwordData);
      set({ loading: false });
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  resetPassword: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await resetPassword(id);
      set({ loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  lockAccount: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await lockAccount(id);
      set({ loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deleteUserById: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteUserById(id);
      await get().getAllUser(); // Tải lại danh sách người dùng sau khi xóa
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
