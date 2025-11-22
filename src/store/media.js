import { create } from "zustand";
import { deleteMedia, getAllMedia, getMediaById } from "../apis/media";

export const mediaStore = create((set, get) => ({
  data: [],
  currentMedia: null,
  error: null,
  loading: false,

  getAllMedia: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllMedia();
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getMediaById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getMediaById(id);
      set({ currentMedia: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deleteMedia: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await deleteMedia(id);
      set((state) => {
        data: state.data.filter((item) => item.id != id);
      });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
