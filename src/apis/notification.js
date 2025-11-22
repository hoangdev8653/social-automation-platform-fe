import { axiosConfig } from "../axiosConfig";

export const getAllNotification = async () => {
  return await axiosConfig({
    method: "get",
    url: "notification",
  });
};

export const getNotificationByUser = async (id) => {
  return await axiosConfig({
    method: "get",
    url: "notification/getByUser",
  });
};

export const updateStatusNotification = async (id) => {
  return await axiosConfig({
    method: "patch",
    url: `notification/${id}`,
  });
};

export const deleteNotification = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `notification/${id}`,
  });
};
