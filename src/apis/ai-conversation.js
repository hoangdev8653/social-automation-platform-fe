import { axiosConfig } from "../axiosConfig";

export const getConversationByUser = async () => {
  return await axiosConfig({
    method: "get",
    url: "ai-conversation/Byuser",
  });
};

export const deleteConversation = async (id) => {
  return await axiosConfig({
    method: "delete",
    url: `ai-conversation/${id}`,
  });
};
