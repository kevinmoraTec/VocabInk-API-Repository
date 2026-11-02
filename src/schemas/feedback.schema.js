import joi from 'joi';
export const CreateFeedbackSchema = joi.object({
    user_id: joi.string().uuid().optional(),
    type: joi.string().valid('bug', 'feature', 'general').required(),   
    message: joi.string().max(1000).required(),
    userEmail: joi.string().email().max(100).optional(),
    userName: joi.string().max(100).optional(),
    current_page: joi.string().max(200).optional()
});
