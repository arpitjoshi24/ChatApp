import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    fileUrl: { type: String },
    type: { type: String, default: "text" }, // text, image, video, file
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
