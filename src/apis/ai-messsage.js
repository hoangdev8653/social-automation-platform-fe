import { axiosConfig } from "../axiosConfig";

export const getMessageByConversation = async (id) => {
  return await axiosConfig({
    method: "get",
    url: `ai-message/conversation/${id}`,
  });
};

export const createMessage = async (data) => {
  return await axiosConfig({
    method: "post",
    url: "ai-message/",
    data,
  });
};
