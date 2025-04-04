import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
} from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/login", login);

router.post("/refreshAccessToken", refreshAccessToken);

router.post("/logout", logout);

export default router;
