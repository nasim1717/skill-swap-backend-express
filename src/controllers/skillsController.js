import prisma from "../config/db.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createOfferdSkiils = async (req, res) => {
    const { skills, user_id } = req.body;

    try {
        const data = await prisma.skills_offered.upsert({
            where: { user_id: user_id },
            update: { skills },
            create: { user_id: user_id, skills },
        })

        return successResponse(res, "Skills offered successfully", data, 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

export const getOfferdSkiils = async (req, res) => {
    const { user_id } = req.user;
    try {
        const data = await prisma.skills_offered.findUnique({ where: { user_id } });
        return successResponse(res, "Skills offered successfully", data, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};


export const createWantedSkills = async (req, res) => {
    const { skills, user_id } = req.body;
    try {
        const data = await prisma.skills_wanted.upsert({
            where: { user_id: user_id },
            update: { skills },
            create: { user_id: user_id, skills },
        })
        return successResponse(res, "Skills wanted successfully", data, 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

export const getWantedSkills = async (req, res) => {
    const { user_id } = req.user;
    try {
        const data = await prisma.skills_wanted.findUnique({ where: { user_id } });
        return successResponse(res, "Skills wanted successfully", data, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};