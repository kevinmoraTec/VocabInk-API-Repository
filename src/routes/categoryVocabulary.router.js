import express from 'express'
const router = express.Router();
import categoryVocabularyService from '../services/categoryVocabulary.service.js'; 
import { validatorHandler } from '../middlewares/validator.handler.js';
import { CreateCategoryVocabularySchema } from '../schemas/categoryVocabulary.schema.js';
const serviceCategoryVocabulary = new categoryVocabularyService();
import { checkAuth } from '../middlewares/checkAuth.handler.js';

router.get('/', checkAuth, async (req, res, next) => {
    try {

        const allCategoryVocabulary = await serviceCategoryVocabulary.getAllCategoryVocabularies();
    
        res.json(allCategoryVocabulary);
        
    } catch (error) {
        next(error);
    }
});

router.get('/:id', checkAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoryVocabulary = await serviceCategoryVocabulary.getCategoryVocabularyById(id);
        res.json(categoryVocabulary);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    checkAuth,
    validatorHandler(CreateCategoryVocabularySchema, 'body'),
    async (req, res, next) => {
    try {
        const body = req.body;

        const newCategoryVocabulary = await serviceCategoryVocabulary.createCategoryVocabulary(body);
        res.status(201).json(newCategoryVocabulary);

    } catch (error) {
        next(error);
    }
});

export default router;