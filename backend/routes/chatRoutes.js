
import express from "express";
import fs from "fs";
import path from "path";

import { getMessages, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadHandler } from "../utils/uploadHandler.js";

const router = express.Router();

router.get("/:receiverId", protect, getMessages);


router.post("/send", protect, uploadHandler, sendMessage);

router.get("/download/:filename", protect, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
});


export default router;
