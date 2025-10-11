import { axiosConfig } from "../axiosConfig";

export const getAllPlatform = async () => {
  return await axiosConfig({
    method: "get",
    url: "platform",
  });
};

export const getPlatformById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `platform/${id}`,
  });
};

export const createPlatform = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "platform",
    data,
  });
};

export const deletePlatform = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `platform/${id}`,
  });
};
