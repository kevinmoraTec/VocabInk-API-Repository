import express from 'express';
const router = express.Router();
import VocabularyService from '../services/vocabulary.service.js'; 
import { validatorHandler } from '../middlewares/validator.handler.js';
import { CreateVocabularySchema } from '../schemas/vocabulary.schema.js';
const serviceVocabulary = new VocabularyService();
import { checkAuth } from '../middlewares/checkAuth.handler.js';

router.get('/', checkAuth, async (req, res, next) => {
    try {
        console.log('Vocabulary Router');

        const allVocabulary = await serviceVocabulary.getAllVocabulary();
                res.json(allVocabulary);
        
    } catch (error) {
        next(error);
    }
});

router.get('/all-vocabulary/:id', checkAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const vocabulary = await serviceVocabulary.getAllVocabularyById(id);
        res.json(vocabulary);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    checkAuth,
    validatorHandler(CreateVocabularySchema, 'body'),
    async (req, res, next) => {
    try {
        const body = req.body;
        body.user_id = req.user.sub;

        
        const newVocabulary = await serviceVocabulary.createVocabulary(body);

        res.status(201).json(newVocabulary);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id',
    checkAuth,
    validatorHandler(CreateVocabularySchema, 'body'),
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        body.user_id = req.user.sub;

        const updatedVocabulary = await serviceVocabulary.updateVocabulary(id, body);
        res.json(updatedVocabulary);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', checkAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        await serviceVocabulary.deleteVocabulary(id);
        res.status(204).json({ message: 'Vocabulary deleted' });
    } catch (error) {
        next(error);
    }
});

export default router;