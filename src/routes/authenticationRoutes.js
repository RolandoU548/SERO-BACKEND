import express from "express";
import {
  login,
  logout,
  refreshToken,
} from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/login", login);

router.get("/refreshToken", refreshToken);

router.post("/logout", logout);

export default router;
