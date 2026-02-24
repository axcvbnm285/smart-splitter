import express from "express";
import multer from "multer";
import { uploadBill } from "../controllers/billController.js";

const router = express.Router();

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
