import joi from 'joi';

export const CreatePostActionSchema = joi.object({
    post_id: joi.string().uuid().required(),
    action_type: joi.string().valid('COPY', 'SHARE_LINKEDIN_URL').required()
});
