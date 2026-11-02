import express from 'express';
const router = express.Router();
import SystemTemplatesService from '../services/systemTemplates.service.js'; 
import { validatorHandler } from '../middlewares/validator.handler.js';
import { CreateSystemTemplateSchema,UpdateSystemTemplateSchema } from '../schemas/systemTemplate.schema.js';
const serviceSystemTemplates = new SystemTemplatesService();
import { checkAuth } from '../middlewares/checkAuth.handler.js';

router.get('/', checkAuth, async (req, res, next) => {
    try {
        console.log('System Templates Router');

        const allTemplates = await serviceSystemTemplates.getAllTemplates();
                res.json(allTemplates);
        
    } catch (error) {
        next(error);
    }
});

router.get('/:id', checkAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const template = await serviceSystemTemplates.getTemplateById(id);
        res.json(template);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    checkAuth,
    validatorHandler(CreateSystemTemplateSchema, 'body'),
    async (req, res, next) => {
    try {
        const body = req.body;
        body.user_id = req.user.sub;

        
        const newTemplate = await serviceSystemTemplates.createTemplate(body);

        res.status(201).json(newTemplate);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id',
    checkAuth,
    validatorHandler(UpdateSystemTemplateSchema, 'body'),
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        body.user_id = req.user.sub;

        const updatedTemplate = await serviceSystemTemplates.updateTemplate(id, body);
        res.json(updatedTemplate);
    } catch (error) {
        next(error);
    }
});

export default router;