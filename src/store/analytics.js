import { create } from "zustand";
import { getAnalyticsAllPost, getAnalyticsOverview } from "../apis/analytics";

export const analyticsStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  getAnalyticsOverview: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAnalyticsOverview();
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error });
    }
  },

  getAnalyticsAllPost: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAnalyticsAllPost();
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error });
    }
  },
}));
