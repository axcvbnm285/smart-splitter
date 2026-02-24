import express from "express";
import { saveBill, getBills, getBillById, deleteBill } from "../controllers/billSaveController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/save", authMiddleware, saveBill);
router.get("/", authMiddleware, getBills);
router.get("/:id", authMiddleware, getBillById);
router.delete("/:id", authMiddleware, deleteBill);

export default router;
