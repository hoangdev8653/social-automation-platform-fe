import { axiosConfig } from "../axiosConfig";

export const getAllPostTaget = async () => {
  return await axiosConfig({
    method: "get",
    url: "postTarget",
  });
};
