import { create } from "zustand";
import { createMessage, getMessageByConversation } from "../apis/ai-messsage";

export const AiMessageStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  getMessageByConversation: async (id) => {
    try {
      set({ loading: true, error: false });
      const response = await getMessageByConversation(id);
      set({ data: response.data.content, loading: false });
      console.log(response.data.content);

      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.response?.message || error.message });
    }
  },
  createMessage: async (data) => {
    try {
      set({ loading: true, error: false });
      const response = await createMessage(data);

      set((state) => ({
        loading: false,
        data: [...state.data, response.data.content],
      }));
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false, error: error.response?.message || error.message });
    }
  },
}));
