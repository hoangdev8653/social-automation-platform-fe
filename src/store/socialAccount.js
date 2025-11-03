import { create } from "zustand";
import {
  createSocialAccount,
  deleteSocialAccount,
  getAllSocialAccount,
  getSocialAccountById,
} from "../apis/socialAccount";

export const socialAccountStore = create((set, get) => ({
  data: [],
  currentSocialAccount: null,
  error: null,
  loading: false,

  getAllSocialAccount: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllSocialAccount();
      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getSocialAccountById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getSocialAccountById(id);
      set({ currentSocialAccount: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  createSocialAccount: async (accountData) => {
    try {
      set({ loading: true, error: null });
      await createSocialAccount(accountData);
      await get().getAllSocialAccount();
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deleteSocialAccount: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteSocialAccount(id);
      await get().getAllSocialAccount();
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
