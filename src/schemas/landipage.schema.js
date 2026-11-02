import joi from 'joi';

export const CreateEmailLandiPageSchema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().max(150).required()
});