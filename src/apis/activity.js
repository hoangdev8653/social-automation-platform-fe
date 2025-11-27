import { axiosConfig } from "../axiosConfig";

export const getAllActivity = async ({ page, limit }) => {
  return await axiosConfig({
    method: "get",
    url: `activity_log?page=${page}&limit=${limit}`,
  });
};

export const deleteActivity = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `activity_log/${id}`,
  });
};
