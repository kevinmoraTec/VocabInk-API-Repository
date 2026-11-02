import usersRouter from './users.router.js';
import landipage from './landipage.router.js';
import authRouter from './auth.router.js';
import vocabulary from './vocabulary.router.js';
import categoryVocabulary from './categoryVocabulary.router.js';
import systemTemplatesRouter from './systemTemplates.router.js';
import postsRouter from './posts.router.js';
import feedbackRouter from './feedback.router.js';
import postActions from './postActions.router.js';
import linkedinRouter from './linkedin.router.js';
import express from 'express';



/**
 * Para solucionar el problema de enrutamiento,
 * define las rutas más específicas antes que las más generales. 
 * Primero el endpoint /, luego /:id. De esta forma, la raíz (/) 
 * se manejará correctamente y /:id solo se activará cuando haya un ID presente.
 */


function routes(app) {

    const router = express.Router();

    // base path for the API
    app.use('/v1', router);

    // app root route
    app.get('/', (req, res) => {
        res.send('<h1>Hello, Express.js Server!     </h1>');
    });



    router.use('/users', usersRouter);
    router.use('/landipage', landipage);
    router.use('/auth', authRouter);
    router.use('/vocabulary', vocabulary);
    router.use('/category-vocabulary', categoryVocabulary);
    router.use('/system-templates', systemTemplatesRouter);
    router.use('/posts', postsRouter);
    router.use('/feedback', feedbackRouter);
    router.use('/post-actions', postActions);
    router.use('/auth/linkedin', linkedinRouter);
}

export default routes;