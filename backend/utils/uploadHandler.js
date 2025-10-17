// backend/utils/uploadHandler.js
import fileUpload from "express-fileupload";

export const uploadHandler = fileUpload({
  createParentPath: true,           // auto-create uploads folder if missing
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB
  abortOnLimit: true,               // reject requests exceeding limit
});
