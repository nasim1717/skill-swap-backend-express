import Joi from "joi";


export const createReviewSchema = Joi.object({
    reviewed_user_id: Joi.alternatives()
        .try(Joi.number(), Joi.string())
        .required()
        .messages({
            'string.empty': 'Reviewed user id is required',
            'number.empty': 'Reviewed user id must be a number or string',
            'any.required': 'Reviewed user id is required',

        }),

    rating: Joi.number().required().max(5).min(1).messages({
        'number.empty': 'Rating is required',
        'number.base': 'Rating must be a number',
        'any.required': 'Rating is required',
        'number.max': 'Rating must be between 1 and 5',
        'number.min': 'Rating must be between 1 and 5',
    }),

    comment: Joi.string().required().messages({
        'string.empty': 'Comment is required',
        'string.base': 'Comment must be a string',
        'any.required': 'Comment is required'
    })
}).unknown(true);