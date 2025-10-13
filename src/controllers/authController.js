import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";


export const register = async (req, res) => {
    try {
        const { name, email, password, } = req.body

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) return errorResponse(res, "User already exists", 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword, },
        });

        const access_token = generateToken({ email: user.email, user_id: user.id.toString() });
        const responseData = {
            user: {
                ...user,
                id: user.id.toString(),
            },
            access_token
        }
        return successResponse(res, "User registered successfully", responseData, 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return errorResponse(res, "User not found", 400);

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return errorResponse(res, "Invalid password", 400);

        const access_token = generateToken({ email: user.email, user_id: user.id.toString() });
        const responseData = {
            user: {
                ...user,
                id: user.id.toString(),
            },
            access_token
        }

        return successResponse(res, "User logged in successfully", responseData, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};
