import { axiosConfig } from "../axiosConfig";

export const getAllTemplateCategory = async () => {
  return await axiosConfig({
    method: "get",
    url: "template-category",
  });
};

export const getTemplateCategoryById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `template-category/${id}`,
  });
};

export const createTemplateCategory = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "template-category",
    data,
  });
};

export const deleteTemplateCategory = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `template-category/${id}`,
  });
};
