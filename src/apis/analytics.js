import { axiosConfig } from "../axiosConfig";

export const getAnalyticsOverview = async () => {
  return await axiosConfig({
    method: "get",
    url: "analytics/overview",
  });
};

export const getAnalyticsAllPost = async () => {
  return await axiosConfig({
    method: "get",
    url: "analytics/all-posts",
  });
};
