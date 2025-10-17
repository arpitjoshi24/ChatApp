import Message from "../models/Message.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // When user joins a room (by userId)
    socket.on("join_room", (userId) => {
      socket.join(userId);
      console.log(`✅ User joined personal room: ${userId}`);
    });

    // When a message is sent
    socket.on("send_message", async (data) => {
      try {
        // Save to DB
        const newMessage = await Message.create({
          sender: data.sender._id,
          receiver: data.receiver._id,
          message: data.message,
          fileUrl: data.fileUrl || null,
          type: data.type || "text",
        });

        const populated = await newMessage.populate("sender receiver", "name");

        // Emit message to both sender and receiver
        io.to(data.receiver._id).emit("receive_message", populated);
        io.to(data.sender._id).emit("receive_message", populated);
      } catch (err) {
        console.error("❌ Socket send_message error:", err);
      }
    });

    socket.on("disconnect", () =>
      console.log("❌ Client disconnected:", socket.id)
    );
  });
};

export default chatSocket;
