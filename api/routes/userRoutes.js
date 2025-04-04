import express from "express";
import { authenticateToken } from "../middleware/authenticateTokenMiddleware.js";
import { authenticateRole } from "../middleware/authenticateRoleMiddleware.js";

import {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  updateOwnUser,
  getOwnUser,
  deleteOwnUser,
  changePassword,
  updateUserRoleById,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);

router.use(authenticateToken);
router.get("/me", getOwnUser);

router.put("/me", updateOwnUser);

router.put("/me/changePassword", changePassword);

router.delete("/me", deleteOwnUser);

router.use(authenticateRole(["admin"]));
router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUserById);

router.put("/updateRole/:id", updateUserRoleById);

router.delete("/:id", deleteUserById);

export default router;
