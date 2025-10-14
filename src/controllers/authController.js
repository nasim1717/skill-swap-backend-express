import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { reviewSummary } from "../utils/helperQuery.js";
import { getUploadFilePath } from "../utils/helper.js";


export const register = async (req, res) => {
    try {
        const { name, email, password, } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) return errorResponse(res, "User already exists", 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword, },
        });

        const access_token = generateToken({ email: user.email, user_id: user.id });
        const responseData = {
            user: {
                ...user,
                profile_picture: user?.profile_picture && `${getUploadFilePath(req)}${user.profile_picture}`,
            },
            access_token
        }

        const reviewSummaryData = await reviewSummary(user.id);

        responseData.user.rating = reviewSummaryData._avg.rating;
        responseData.user.reviewCount = reviewSummaryData._count.id;

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

        const access_token = generateToken({ email: user.email, user_id: user.id });
        const responseData = {
            user: {
                ...user,
                profile_picture: user?.profile_picture && `${getUploadFilePath(req)}${user.profile_picture}`,
            },
            access_token
        }

        const reviewSummaryData = await reviewSummary(user.id);


        responseData.user.rating = reviewSummaryData._avg.rating;
        responseData.user.reviewCount = reviewSummaryData._count.id;

        return successResponse(res, "User logged in successfully", responseData, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};
