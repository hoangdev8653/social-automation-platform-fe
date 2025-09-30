import { axiosConfig } from "../axiosConfig";

export const getAllUser = async () => {
  return await axiosConfig({
    method: "get",
    url: "user/all",
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

export const changePassword = async (data) => {
  return await axiosConfig({
    method: "post",
    url: `user/change-password`,
    data,
  });
};

export const deleteUserById = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `user/${id}`,
  });
};
