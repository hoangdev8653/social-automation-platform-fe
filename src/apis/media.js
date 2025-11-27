import { axiosConfig } from "../axiosConfig";

export const getAllMedia = async ({ page, limit }) => {
  return await axiosConfig({
    method: "get",
    url: `media?page=${page}&limit=${limit}`,
  });
};

export const getMediaById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `media/${id}`,
  });
};

export const deleteMedia = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `media/${id}`,
  });
};
