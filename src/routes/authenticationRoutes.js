import express from "express";
import { authenticateToken } from "../middleware/authenticateTokenMiddleware.js";
import { login, logout } from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/login", login);

router.use(authenticateToken);

router.post("/logout", logout);

export default router;
