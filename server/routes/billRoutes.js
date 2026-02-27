import express from "express";
import multer from "multer";
import { uploadBill } from "../controllers/billController.js";

const router = express.Router();

// Use memory storage instead of disk
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("bill"), uploadBill);

router.get("/test", (req, res) => {
  res.json({ message: "Bill route working" });
});


export default router;
