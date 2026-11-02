import Joi from 'joi';

const shareTextPost = Joi.object({
    text: Joi.string().min(1).max(3000).required()
        .messages({
            'string.empty': 'Post text is required',
            'string.max': 'Post text cannot exceed 3000 characters'
        })
});

const shareArticlePost = Joi.object({
    text: Joi.string().min(1).max(3000).required(),
    article: Joi.object({
        url: Joi.string().uri().required(),
        title: Joi.string().max(200).optional(),
        description: Joi.string().max(256).optional()
    }).required()
});

const shareImagePost = Joi.object({
    text: Joi.string().min(1).max(3000).required(),
    imageAltText: Joi.string().max(200).optional()
});

export { shareTextPost, shareArticlePost, shareImagePost };
