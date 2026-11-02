import express from 'express';
const router = express.Router();

import { checkAuth } from '../middlewares/checkAuth.handler.js';
import { CreatePostActionSchema } from '../schemas/postActions.schema.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import PostActionsService from '../services/postActions.service.js';
const servicePostActions = new PostActionsService();

router.get('/',
    checkAuth,
     async (req, res, next) => {
    try {
        const allPostActions = await servicePostActions.getAllPostActions();
        res.json(allPostActions);
    } catch (error) {
        next(error);
    }
});

router.get('/user/:user_id',
    checkAuth,
     async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const postActions = await servicePostActions.getAllPostActionsByUserId(user_id);
        res.json(postActions);
    } catch (error) {
        next(error);
    }
});

router.get('/post/:post_id',
    checkAuth,
     async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const postActions = await servicePostActions.getAllPostActionsByPostId(post_id);
        res.json(postActions);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    checkAuth,
    validatorHandler(CreatePostActionSchema, 'body'),
    async (req, res, next) => {
    try {
        const body = req.body;
        body.user_id = req.user.sub;

        console.log('I receive this information:', body);
        
        const postAction = await servicePostActions.createPostAction(body);
        res.status(201).json({
            message: 'Post action created successfully',
            data: postAction
        });
    } catch (error) {
        next(error);
    }
});
export default router;