import joi from 'joi';

export const CreateCategoryVocabularySchema = joi.object({ 
    name: joi.string().max(100).required(),
    //description: joi.string().max(500).required()
});

export const UpdateCategoryVocabularySchema = joi.object({
    name: joi.string().max(100).optional(),
    //description: joi.string().max(500).optional()
}); 