import { create } from "zustand";
import {
  createPlatform,
  deletePlatform,
  getAllPlatform,
  getPlatformById,
} from "../apis/platform";

export const platformStore = create((set, get) => ({
  data: [],
  currentPlatform: null,
  error: null,
  loading: false,

  getAllPlatform: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllPlatform();
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getPlatformById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getPlatformById(id);
      set({ currentPlatform: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  createPlatform: async (platformData) => {
    try {
      set({ loading: true, error: null });
      await createPlatform(platformData);
      await get().getAllPlatform();
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deletePlatform: async (id) => {
    try {
      set({ loading: true, error: null });
      await deletePlatform(id);
      await get().getAllPlatform();
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
