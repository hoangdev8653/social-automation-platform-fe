import { axiosConfig } from "../axiosConfig";

export const getAllMedia = async () => {
  return await axiosConfig({
    method: "get",
    url: "media",
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
