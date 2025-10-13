export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const formattedErrors = error.details.reduce((acc, detail) => {
            const path = detail.path[0];
            acc[path] = detail.message;
            return acc;
        }, {});

        return res.status(400).json({
            message: 'Validation failed',
            errors: formattedErrors
        });
    }

    req.body = value;
    next();
};