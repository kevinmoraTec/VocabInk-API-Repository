
import express from 'express';
const router = express.Router();
import { checkAuth } from '../middlewares/checkAuth.handler.js';
import { CreateFeedbackSchema } from '../schemas/feedback.schema.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import FeedbackService from '../services/feedback.service.js';
const serviceFeedback = new FeedbackService();

router.get('/',
    checkAuth,
     async (req, res, next) => {
    try {
        const allFeedbacks = await serviceFeedback.getAllFeedbacks();
        res.json(allFeedbacks);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    checkAuth,
    validatorHandler(CreateFeedbackSchema, 'body'),
    async (req, res, next) => {
    try {
        const body = req.body;

        console.log('I receive this information:', body);
        
        const feedback = await serviceFeedback.createFeedback(body);
        res.status(201).json({
            message: 'Feedback received successfully',
            data: feedback
        });
    } catch (error) {
        next(error);
    }
});
export default router;