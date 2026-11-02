import joi from 'joi';


export const CreateVocabularySchema = joi.object({
    word_or_phrase: joi.string().max(100).required(),
    context_note: joi.string().max(500).required(),
    //user_id: joi.number().integer().required()
    id_category_vocabulary: joi.string().optional()
});

export const UpdateVocabularySchema = joi.object({
    word_or_phrase: joi.string().max(100).optional(),
    context_note: joi.string().max(500).optional(),
    id_category_vocabulary: joi.number().integer().optional()
});