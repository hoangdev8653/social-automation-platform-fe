import { create } from "zustand";
import {
  deleteConversation,
  getConversationByUser,
} from "../apis/ai-conversation";

export const AiConversationStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  getConversationByUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getConversationByUser();
      set({ loading: false, data: response.data });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.response.message || error.message });
    }
  },

  deleteConversation: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteConversation(id);
      set((state) => ({
        loading: false,
        data: state.data.filter((item) => item.id != id),
      }));
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error?.response?.message || error.message });
    }
  },
}));
