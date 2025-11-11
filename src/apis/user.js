import { axiosConfig } from "../axiosConfig";

export const getAllUser = async () => {
  return await axiosConfig({
    method: "get",
    url: "user",
  });
};

export const getUserById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `user/${id}`,
  });
};

export const updateUserById = async (id, data) => {
  return await axiosConfig({
    method: "put",
    url: `user/${id}`,
    data,
  });
};

export const updatePassword = async (data) => {
  return await axiosConfig({
    method: "put",
    url: `user/update-password`,
    data,
  });
};

export const resetPassword = async (id) => {
  return await axiosConfig({
    method: "put",
    url: `user/reset-password/${id}`,
  });
};

export const lockAccount = async (id) => {
  return await axiosConfig({
    method: "put",
    url: `user/lock-account/${id}`,
  });
};

export const deleteUserById = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `user/${id}`,
  });
};
