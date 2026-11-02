import joi from 'joi';

export const CreateSystemTemplateSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    description: joi.string().max(500).optional(),
    ai_prompt: joi.string().required(),
    icon: joi.string().required(),
    structure: joi.alternatives().try(joi.object(), joi.allow(null)).optional(),
    is_active: joi.boolean().optional(),
    example_preview: joi.alternatives().try(joi.string(), joi.allow(null)).optional()

});


export const UpdateSystemTemplateSchema = joi.object({
    name: joi.string().min(3).max(100).optional(),
    description: joi.string().max(500).optional(),
    ai_prompt: joi.string().optional(),
    icon: joi.string().optional(),
    is_active: joi.boolean().optional()

});