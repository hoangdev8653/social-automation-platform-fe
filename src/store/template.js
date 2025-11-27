import { create } from "zustand";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplate,
  getTemplateById,
} from "../apis/template";
import { ITEMS_PER_PAGE, PAGE_DEFAUT } from "../utils/constants";

export const templateStore = create((set, get) => ({
  data: [],
  currentTemplate: null,
  error: null,
  loading: false,

  getAllTemplate: async ({
    page = PAGE_DEFAUT,
    limit = ITEMS_PER_PAGE,
  } = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await getAllTemplate({ page, limit });
      set({ data: response?.data?.content, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getTemplateById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getTemplateById(id);
      set({ currentTemplate: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  createTemplate: async (templateData) => {
    try {
      set({ loading: true, error: null });
      await createTemplate(templateData);
      await get().getAllTemplate(); // Tải lại danh sách sau khi tạo
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deleteTemplate: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteTemplate(id);
      await get().getAllTemplate(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
