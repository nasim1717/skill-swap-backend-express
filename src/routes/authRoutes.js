import express from "express";
import { register, login } from "../controllers/authController.js";
import { loginSchema, registerSchema } from "../validations/userValidation.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
