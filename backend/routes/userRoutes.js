import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(protect, getAllUsers);
router.route("/:id").get(protect, getUserById).put(protect, updateUser).delete(protect, deleteUser);

export default router;
