import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js"
import { createOfferdSkiils, createWantedSkills, getOfferdSkiils, getWantedSkills } from "../controllers/skillsController.js";
import { updateProfileScema } from "../validations/userValidation.js";
import { validate } from "../middlewares/validate.js";
import { getUserProfile, updateProfile } from "../controllers/userController.js";
import { createReviewSchema, offerdSkillsSchema, wantedSkillsSchema } from "../validations/skillsValidationl.js";
import { createReview, getReviewList } from "../controllers/reviewController.js";


const router = express.Router();


router.post("/offerd-skills", authenticate, validate(offerdSkillsSchema), createOfferdSkiils);
router.get("/offerd-skills", authenticate, getOfferdSkiils);

router.post("/wanted-skills", authenticate, validate(wantedSkillsSchema), createWantedSkills);
router.get("/wanted-skills", authenticate, getWantedSkills);

router.get("/profile/:id", authenticate, getUserProfile);
router.put("/update-profile", authenticate, validate(updateProfileScema), updateProfile);
router.get("/reviews/:id", authenticate, getReviewList);
router.post("/reviews", authenticate, validate(createReviewSchema), createReview);

export default router;
