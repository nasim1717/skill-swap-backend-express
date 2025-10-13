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