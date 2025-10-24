import prisma from "../config/db.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { parseSkills } from "../utils/helper.js";
import { reviewSummary } from "../utils/helperQuery.js";


export const getMatches = async (req, res) => {
    try {
        const { search } = req.query;
        const loggedUserId = req.user.user_id;
        const loggedUserSkills = await prisma.skills_wanted.findUnique({ where: { user_id: loggedUserId } });

        const userSkills = parseSkills(loggedUserSkills.skills);

        if (userSkills.length === 0) {
            return successResponse(res, "No matches found", { total_matches: 0, matched_users: [] }, 200);
        };

        const otherUsers = await prisma.users.findMany({
            where: { id: { not: loggedUserId } },
            include: {
                skills_offered: true,
                skills_wanted: true,
                reviews_received: { select: { rating: true } },
            },
        });

        const matchedUsersPromises = otherUsers
            .map(async (user) => {
                const skillsString = user.skills_offered[0]?.skills || "";

                const otherSkills = parseSkills(skillsString);

                const matchedSkills = otherSkills.filter((skill) => {

                    return search ? skill.includes(search.toLowerCase()) : userSkills.includes(skill)
                });

                const matchPercent =
                    (matchedSkills.length / userSkills.length) * 100;

                // average rating

                const ragting = await reviewSummary(user.id);
                const average_rating = ragting._avg.rating;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    location: user.location,
                    matched_skills: matchedSkills,
                    skills_offered: user.skills_offered[0]?.skills,
                    skills_wanted: user.skills_wanted[0]?.skills,
                    match_percent: parseFloat(matchPercent.toFixed(2)),
                    average_rating,
                };
            })

        const matchedUsersResolved = await Promise.all(matchedUsersPromises);


        const matchedUsers = matchedUsersResolved
            .filter((u) => u.match_percent > 1)
            .sort((a, b) => b.match_percent - a.match_percent);




        const data = {
            total_matches: matchedUsers.length,
            matched_users: matchedUsers,
        }

        return successResponse(res, "Matches fetched successfully", data, 200);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};