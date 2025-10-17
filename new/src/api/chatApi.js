import axios from "./axiosConfig";

export const fetchMessages = (senderId, receiverId) =>
  axios.get(`/chat?senderId=${senderId}&receiverId=${receiverId}`);
