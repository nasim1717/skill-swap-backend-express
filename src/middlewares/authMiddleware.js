import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/apiResponse.js";


export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return errorResponse(res, "Unauthorized User", 401);
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (req.method === "GET" || !req?.body) {
            req.user = decoded;
            return next();
        }
        req.body.user_id = decoded?.user_id;
        req.body.email = decoded?.email;
        next();
    } catch (error) {
        console.log("error", error)
        return errorResponse(res, "Unauthorized User", 401);
    }
};
