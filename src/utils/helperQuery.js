import prisma from "../config/db.js";

export const reviewSummary = async (id) => {
    try {
        const data = await prisma.reviews.aggregate({
            where: { reviewed_user_id: id },
            _avg: {
                rating: true,
            },
            _count: { id: true }
        });
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}