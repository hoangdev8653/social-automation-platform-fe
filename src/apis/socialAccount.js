import { axiosConfig } from "../axiosConfig";

export const getAllSocialAccount = async () => {
  return await axiosConfig({
    method: "get",
    url: "social-account",
  });
};

export const getSocialAccountById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `social-account/${id}`,
  });
};

export const createSocialAccount = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "social-account",
  });
};

export const deleteSocialAccount = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: "social-account",
  });
};
