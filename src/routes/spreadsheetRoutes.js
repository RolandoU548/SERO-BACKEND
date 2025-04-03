import express from "express";
import {
  createSpreadsheet,
  getAllSpreadsheets,
  getSpreadsheetById,
  updateSpreadsheetById,
  deleteSpreadsheetById,
  getSpreadsheetByUserId,
  getOwnSpreadsheet,
  updateOwnSpreadsheet,
  deleteOwnSpreadsheet,
} from "../controllers/spreadsheetController.js";
import { authenticateRole } from "../middleware/authenticateRoleMiddleware.js";

const router = express.Router();

router.post("/", createSpreadsheet);
router.get("/me", getOwnSpreadsheet);
router.put("/me", updateOwnSpreadsheet);
router.delete("/me", deleteOwnSpreadsheet);

router.use(authenticateRole(["admin"]));
router.get("/user/:userId", getSpreadsheetByUserId);

router.get("/:id", getSpreadsheetById);

router.put("/:id", updateSpreadsheetById);

router.get("/", getAllSpreadsheets);

router.delete("/:id", deleteSpreadsheetById);

export default router;
