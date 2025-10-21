import { create } from "zustand";
import {
  approvePost,
  createPost,
  deletePost,
  getAllPost,
  getPostById,
} from "../apis/post";

export const postStore = create((set, get) => ({
  data: [],
  currentPost: null,
  error: null,
  loading: false,

  getAllPost: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllPost();
      set({ data: response.data, loading: false });
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
      await createPost(postData);
      await get().getAllPost();
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  approvePost: async (id) => {
    try {
      set({ loading: true, error: null });
      await approvePost(id);
      await get().getAllPost();
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
