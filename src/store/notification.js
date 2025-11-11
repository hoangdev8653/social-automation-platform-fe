import { create } from "zustand";
import {
  getNotificationByUser,
  updateStatusNotification,
  deleteNotification,
} from "../apis/notification";

export const notificationStore = create((set, get) => ({
  data: [],
  error: null,
  loading: false,

  getNotificationByUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getNotificationByUser();
      set({ loading: false, data: response.data });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },

  updateStatusNotification: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await updateStatusNotification(id);
      set({ loading: false });

      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },

  deleteNotification: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteNotification(id);
      await get().getNotificationByUser();
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.message });
    }
  },
}));
