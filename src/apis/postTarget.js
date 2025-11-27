import { axiosConfig } from "../axiosConfig";

export const getAllPostTaget = async ({ page, limit }) => {
  return await axiosConfig({
    method: "get",
    url: `postTarget?page=${page}&limit=${limit}`,
  });
};
