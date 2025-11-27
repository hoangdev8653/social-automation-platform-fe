import { create } from "zustand";
import { deleteActivity, getAllActivity } from "../apis/activity";
import { ITEMS_PER_PAGE, PAGE_DEFAUT } from "../utils/constants";

export const activityStore = create((set, get) => ({
  data: [],
  error: null,
  loading: false,

  getAllActivity: async ({
    page = PAGE_DEFAUT,
    limit = ITEMS_PER_PAGE,
  } = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await getAllActivity({ page, limit });
      set({ data: response.data.content, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
  deleteActivity: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await deleteActivity(id);
      set((state) => {
        data: state.data.filter((item) => item.id != id);
        loading: false;
      });
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
