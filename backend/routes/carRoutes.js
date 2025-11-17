import express from "express";
import { getCars, addCar } from "../controllers/carController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCars);
router.post("/", protect, adminOnly, addCar);

export default router;
