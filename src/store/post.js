import { create } from "zustand";
import {
  approvePost,
  createPost,
  deletePost,
  getAllPost,
  getPostById,
  getPostByUser,
  rejectPost,
} from "../apis/post";
import { ITEMS_PER_PAGE, PAGE_DEFAUT } from "../utils/constants";

export const postStore = create((set, get) => ({
  data: [],
  currentPost: null,
  error: null,
  loading: false,

  getAllPost: async ({ page = PAGE_DEFAUT, limit = ITEMS_PER_PAGE } = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await getAllPost({ page, limit });
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getPostByUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getPostByUser();
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getPostById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getPostById(id);
      set({ currentPost: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  createPost: async (postData) => {
    try {
      set({ loading: true, error: null });
      const response = await createPost(postData);
      set({ loading: false, error: null });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  approvePost: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await approvePost(id);
      set({ loading: false, error: null });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  rejectPost: async (id, reason) => {
    try {
      set({ loading: true, error: null });
      const response = await rejectPost(id, reason);
      set({ loading: false, error: null });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deletePost: async (id) => {
    try {
      set({ loading: true, error: null });
      await deletePost(id);
      await get().getAllPost();
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
