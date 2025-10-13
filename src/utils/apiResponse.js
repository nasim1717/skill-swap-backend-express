export const successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, message, statusCode = 400, errors = null) => {
    if (errors) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
