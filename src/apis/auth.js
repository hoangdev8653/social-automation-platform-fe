import { axiosConfig } from "../axiosConfig";

export const register = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "user/register",
    data,
  });
};

export const login = async (data) => {
  return await axxiosConfig({
    method: "post",
    url: "user/login",
    data,
  });
};

export const logout = async () => {
  return await axiosConfig({
    method: "post",
    url: "user/logout",
  });
};

export const refreshToken = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "user/refresh-token",
    data,
  });
};
