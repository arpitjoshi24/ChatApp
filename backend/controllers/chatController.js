
import Message from "../models/Message.js";
import path from "path";
import fs from "fs";

export const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender receiver", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.body.receiver;
    const text = req.body.text || "";
    let fileUrl = null;

    if (req.files && req.files.file) {
      const file = req.files.file;

    
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const filename = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(uploadDir, filename);

      await file.mv(uploadPath);

     
      fileUrl = filename;
    }

    if (!receiverId || (!text && !fileUrl)) {
      return res.status(400).json({ message: "Invalid message data" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: text,
      fileUrl,
      type: fileUrl ? "file" : "text",
    });

    const populatedMessage = await newMessage.populate("sender receiver", "name email");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};
