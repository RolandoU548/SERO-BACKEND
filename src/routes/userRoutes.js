import express from "express";
import { authenticateToken } from "../middleware/authenticateTokenMiddleware.js";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
} from "../controllers/usersController.js";

const router = express.Router();

router.post("/", createUser);

router.use(authenticateToken);

router.get("/:id", getUserById);

router.get("/", getAllUsers);

router.put("/:id", updateUserById);

router.delete("/:id", deleteUserById);

export default router;
