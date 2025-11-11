import { create } from "zustand";
import {
  updatePassword,
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

  updateUserById: async (id, name) => {
    try {
      set({ loading: true, error: null });
      console.log(id);
      console.log(name);

      const response = await updateUserById(id, { name });
      set({ loading: false, error: null });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  updatePassword: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await updatePassword(data);
      set({ loading: false, erorr: null });
      return response;
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
