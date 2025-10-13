export const errorHandler = (err, req, res, next) => {


    // Prisma DB validation error (example)
    if (err.code === "P2002") {
        return res.status(400).json({
            status: "fail",
            message: "Duplicate field value violates unique constraint",
        });
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            status: "fail",
            message: "Invalid token",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            status: "fail",
            message: "Token has expired",
        });
    }

    // Default error response
    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};
