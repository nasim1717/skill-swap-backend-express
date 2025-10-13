import { errorResponse, successResponse } from "../utils/apiResponse.js";
import prisma from "../config/db.js";

export const createReview = async (req, res) => {
    const { user_id, reviewed_user_id, rating, comment } = req.body;
    try {
        const data = await prisma.reviews.create({
            data: {
                reviewer_id: user_id,
                reviewed_user_id,
                rating,
                comment,
            }
        });
        return successResponse(res, "Review created successfully", data, 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};


export const getReviewList = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await prisma.reviews.findMany({
            where: { reviewed_user_id: id },
            select: { reviewed_user_id: true, rating: true, comment: true, created_at: true, id: true }
        });
        return successResponse(res, "Reviews fetched successfully", data, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
}

