import express from "express";
import { getMatches } from "../controllers/matchingController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getMatches);

export default router;