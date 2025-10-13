
import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.base': 'Name must be a string',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

    confirm_password: Joi.string().min(6).required().valid(Joi.ref('password')).messages({
        'string.empty': 'Confirm password is required',
        'string.min': 'Confirm password must be at least 6 characters',
        'any.required': 'Confirm password is required',
        'any.only': 'Passwords do not match'
    })
}).unknown(true);


export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
}).unknown(true);

export const updateProfileScema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'string.base': 'Name must be a string',
        'any.required': 'Name is required'
    }),
    location: Joi.string().required().messages({
        'string.empty': 'Location is required',
        'string.base': 'Location must be a string',
        'any.required': 'Location is required'
    }),
    bio: Joi.string().required().messages({
        'string.empty': 'Bio is required',
        'string.base': 'Bio must be a string',
        'any.required': 'Bio is required'
    })
}).unknown(true);




