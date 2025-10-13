import Joi from "joi";

export const offerdSkillsSchema = Joi.object({

    skills: Joi.string().required().messages({
        'string.empty': 'Skills is required',
        'string.base': 'Skills must be a string',
        'any.required': 'Skills is required'
    })
}).unknown(true);


export const wantedSkillsSchema = Joi.object({

    skills: Joi.string().required().messages({
        'string.empty': 'Skills is required',
        'string.base': 'Skills must be a string',
        'any.required': 'Skills is required'
    })
}).unknown(true);


export const createReviewSchema = Joi.object({
    reviewed_user_id: Joi.alternatives()
        .try(Joi.number(), Joi.string())
        .required()
        .messages({
            'string.empty': 'Reviewed user id is required',
            'number.empty': 'Reviewed user id must be a number or string',
            'any.required': 'Reviewed user id is required',

        }),

    rating: Joi.number().required().messages({
        'number.empty': 'Rating is required',
        'number.base': 'Rating must be a number',
        'any.required': 'Rating is required'
    }),

    comment: Joi.string().required().messages({
        'string.empty': 'Comment is required',
        'string.base': 'Comment must be a string',
        'any.required': 'Comment is required'
    })
}).unknown(true);