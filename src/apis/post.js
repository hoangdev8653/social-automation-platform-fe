import { axiosConfig } from "../axiosConfig";

export const getAllPost = async () => {
  return await axiosConfig({
    method: "get",
    url: "post",
  });
};

export const getPostByUser = async () => {
  return await axiosConfig({
    method: "get",
    url: "post/ByUser",
  });
};

export const getPostById = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `post/${id}`,
  });
};

export const createPost = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "post",
    data,
  });
};

export const approvePost = async (id) => {
  return await axiosConfig({
    method: "patch",
    url: `post/${id}/approve`,
  });
};

export const rejectPost = async (id) => {
  return await axiosConfig({
    method: "patch",
    url: `post/${id}/reject`,
  });
};

export const deletePost = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `post/${id}`,
  });
};
