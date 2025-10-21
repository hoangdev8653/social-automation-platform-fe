import { axiosConfig } from "../axiosConfig";

export const register = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "auth/register",
    data,
  });
};

export const login = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "auth/login",
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
