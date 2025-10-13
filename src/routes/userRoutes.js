import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js"
import { createOfferdSkiils, createWantedSkills, getOfferdSkiils, getWantedSkills } from "../controllers/skillsController.js";
const router = express.Router();


router.post("/offerd-skills", authenticate, createOfferdSkiils);
router.get("/offerd-skills", authenticate, getOfferdSkiils);
router.post("/wanted-skills", authenticate, createWantedSkills);
router.get("/wanted-skills", authenticate, getWantedSkills);

export default router;
