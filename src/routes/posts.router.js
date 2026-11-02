import express from 'express';
const router = express.Router();
import { checkAuth } from '../middlewares/checkAuth.handler.js';


import PostsService from '../services/posts.service.js'; 
// import { validatorHandler } from '../middlewares/validator.handler.js';
// import { CreatePostSchema, UpdatePostSchema } from '../schemas/post.schema.js';

const servicePosts = new PostsService();

router.get('/', async (req, res, next) => {
    try {
        const allPosts = await servicePosts.getAllPosts();
        res.json(allPosts);
    } catch (error) {
        next(error);
    }
});

//Get recent posts by user ID only 'published' and 'draft' posts
router.get('/user/:id',
    checkAuth,
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await servicePosts.getThreeLastestPostsPublishedByUserId(id);
        res.json(post);
    } catch (error) {
        next(error);
    }
});

router.get('/drafts/:id', 
    checkAuth,
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await servicePosts.getThreeLastestPostsByUserId(id);
        res.json(post);
    } catch (error) {
        next(error);
    }
});

router.post('/generate',
    checkAuth,
 //   validatorHandler(CreatePostSchema, 'body'),
    async (req, res, next) => {
    try {
        const body = req.body;
        body.user_id = req.user.sub;

        const postsArray = await servicePosts.createPost(body);
    

        res.json(postsArray);
        // const newPost = await servicePosts.createPost(body);
        // res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/saved',
    checkAuth,
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await servicePosts.updatePost(id, { status: 'published' });
        res.json(post);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id',
    checkAuth,
 //   validatorHandler(UpdatePostSchema, 'body'),
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        console.log('This is the info', body);

        const updatedPost = await servicePosts.updatePost(id, body);
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id',
    checkAuth,  
    async (req, res, next) => {
    try {
        const { id } = req.params;
        await servicePosts.deletePost(id);
        res.status(204).json({ message: 'Post deleted' });
    } catch (error) {
        next(error);
    }
});

export default router;