import { create } from "zustand";
import { getAllPostTaget } from "../apis/postTarget";

export const postTargetStore = create((set) => ({
  data: [],
  error: null,
  loading: false,

  getAllPostTaget: async () => {
    try {
      set({ loading: true });
      const response = await getAllPostTaget();
      set({ loading: false, data: response.data });
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },
}));
