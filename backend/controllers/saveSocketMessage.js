
import Message from "../models/Message.js";

export const saveSocketMessage = async ({ senderId, receiverId, text, file }) => {
  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message: text,
    fileUrl: file || null,
    type: file ? "file" : "text",
  });

  return await newMessage.populate("sender receiver", "name email");
};
