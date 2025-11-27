import { create } from "zustand";
import { getAllPostTaget } from "../apis/postTarget";
import { ITEMS_PER_PAGE, PAGE_DEFAUT } from "../utils/constants";

export const postTargetStore = create((set) => ({
  data: [],
  error: null,
  loading: false,

  getAllPostTaget: async ({
    page = PAGE_DEFAUT,
    limit = ITEMS_PER_PAGE,
  } = {}) => {
    try {
      set({ loading: true });
      const response = await getAllPostTaget({ page, limit });
      set({ loading: false, data: response.data });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },
}));
