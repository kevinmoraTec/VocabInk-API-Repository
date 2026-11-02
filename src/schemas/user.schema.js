import joi from 'joi';

export const CreateUserSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    birth_year: joi.number().integer().min(1900).max(2024)
});