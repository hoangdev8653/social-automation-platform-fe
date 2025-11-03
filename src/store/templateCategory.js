import { create } from "zustand";
import {
  createTemplateCategory,
  deleteTemplateCategory,
  getAllTemplateCategory,
  getTemplateCategoryById,
} from "../apis/templateCategory";

export const templateCategoryStore = create((set, get) => ({
  data: [],
  currentTemplateCategory: null,
  error: null,
  loading: false,

  getAllTemplateCategory: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllTemplateCategory();

      set({ data: response.data, loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  getTemplateCategoryById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await getTemplateCategoryById(id);
      set({ currentTemplateCategory: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  createTemplateCategory: async (categoryData) => {
    try {
      set({ loading: true, error: null });
      await createTemplateCategory(categoryData);
      await get().getAllTemplateCategory(); // Tải lại danh sách sau khi tạo
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },

  deleteTemplateCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteTemplateCategory(id);
      await get().getAllTemplateCategory(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.log(error);
      set({ error: error.message, loading: false });
    }
  },
}));
