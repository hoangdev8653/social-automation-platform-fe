import { axiosConfig } from "../axiosConfig";

export const getAllTemplate = async ({ page, limit }) => {
  return await axiosConfig({
    method: "get",
    url: `template?page=${page}&limit=${limit}`,
  });
};

export const getTemplateById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `template/${id}`,
  });
};

export const createTemplate = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "template",
    data,
  });
};

export const deleteTemplate = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `template/${id}`,
  });
};
