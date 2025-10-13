import prisma from "../config/db.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { reviewSummary } from "../utils/helperQuery.js";

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


export const getUserProfile = async (req, res) => {
    try {
        const userId = BigInt(req.params.id);

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                skills_offered: true,
                skills_wanted: true,
                reviews_received: {
                    include: {
                        reviewer: {
                            select: {
                                id: true,
                                name: true,
                                profile_picture: true,
                            },
                        },
                    },
                    orderBy: { created_at: 'desc' },
                },
            },
        });


        const averageRatingData = await reviewSummary(userId);

        const profileData = {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_picture: user.profile_picture,
            bio: user.bio,
            location: user.location,
            created_at: user.created_at,
            skills_offered: user.skills_offered?.[0]?.skills || null,
            skills_wanted: user.skills_wanted?.[0]?.skills || null,
            reviews: user.reviews_received,
            average_rating: averageRatingData._avg.rating || 0,
            total_reviews: averageRatingData._count.id,
        };
        return successResponse(res, "Profile fetched successfully", profileData, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};