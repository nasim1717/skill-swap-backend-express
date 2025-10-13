import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js"
import { createOfferdSkiils, createWantedSkills, getOfferdSkiils, getWantedSkills } from "../controllers/skillsController.js";
import { updateProfileScema } from "../validations/userValidation.js";
import { validate } from "../middlewares/validate.js";
import { updateProfile } from "../controllers/userController.js";
import { offerdSkillsSchema, wantedSkillsSchema } from "../validations/skillsValidationl.js";


const router = express.Router();


router.post("/offerd-skills", authenticate, validate(offerdSkillsSchema), createOfferdSkiils);
router.get("/offerd-skills", authenticate, getOfferdSkiils);

router.post("/wanted-skills", authenticate, validate(wantedSkillsSchema), createWantedSkills);
router.get("/wanted-skills", authenticate, getWantedSkills);

router.put("/update-profile", authenticate, validate(updateProfileScema), updateProfile);

export default router;
