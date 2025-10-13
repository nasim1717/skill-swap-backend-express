import prisma from "../config/db.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const updateProfile = async (req, res) => {
    const { name, location, bio, user_id } = req.body;

    try {
        const data = await prisma.users.update({
            where: { id: user_id },
            data: { name, location, bio }
        });
        return successResponse(res, "Profile updated successfully", data, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
}