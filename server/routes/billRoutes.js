import express from "express";
import multer from "multer";
import fs from "fs";
import { uploadBill } from "../controllers/billController.js";

const router = express.Router();

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("bill"), uploadBill);

router.get("/test", (req, res) => {
  res.json({ message: "Bill route working" });
});


export default router;
