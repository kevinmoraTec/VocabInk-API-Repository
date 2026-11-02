import express from 'express';
const router = express.Router();
import passportConfig from '../utils/index.js';
import { config } from '../../config/config.js';
import { checkAuth } from '../middlewares/checkAuth.handler.js';
import LinkedinService from '../services/linkedin.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { shareTextPost, shareArticlePost } from '../schemas/linkedin.schema.js';
import multer from 'multer';

const linkedinService = new LinkedinService();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200MB max for videos
    },
    fileFilter: (req, file, cb) => {
        // Allow images and videos
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedTypes.join(', ')}`), false);
        }
    }
});

// Initiate LinkedIn OAuth (user must be authenticated first)
router.get('/connect',
    checkAuth,
    (req, res, next) => {
        // Store user info in session for the callback
        req.session = req.session || {};
        req.session.userId = req.user.sub;
        next();
    },
    passportConfig.authenticate('linkedin', {
        state: true
    })
);

// LinkedIn OAuth callback
router.get('/callback',
    passportConfig.authenticate('linkedin', {
        failureRedirect: `${config.frontendURL}/onboarding?linkedin=error`,
        session: false
    }),
    (req, res) => {
        try {
            // Redirect back to frontend with success
            const redirectUrl = `${config.frontendURL}/onboarding?linkedin=connected`;
            console.log('LinkedIn connected, redirecting to:', redirectUrl);
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('LinkedIn callback error:', error);
            res.redirect(`${config.frontendURL}/onboarding?linkedin=error`);
        }
    }
);

// Check LinkedIn connection status
router.get('/status',
    checkAuth,
    async (req, res, next) => {
        try {
            const UsersService = (await import('../services/user.service.js')).default;
            const userService = new UsersService();
            const user = await userService.getUserById(req.user.sub);
            
            res.json({
                connected: !!user.linked_in_id,
                linkedinId: user.linked_in_id || null
            });
        } catch (error) {
            next(error);
        }
    }
);

// Disconnect LinkedIn account
router.post('/disconnect',
    checkAuth,
    async (req, res, next) => {
        try {
            const UsersService = (await import('../services/user.service.js')).default;
            const userService = new UsersService();
            
            await userService.updateUser(req.user.sub, {
                linked_in_id: null,
                linkedin_access_token: null,
                linkedin_refresh_token: null
            });
            
            res.json({ message: 'LinkedIn account disconnected successfully' });
        } catch (error) {
            next(error);
        }
    }
);

// Share a text post on LinkedIn
router.post('/share',
    checkAuth,
    validatorHandler(shareTextPost, 'body'),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            const result = await linkedinService.shareTextPost(req.user.sub, text);
            
            res.json({
                message: 'Post shared successfully on LinkedIn',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

// Share a post with an article/link on LinkedIn
router.post('/share/article',
    checkAuth,
    validatorHandler(shareArticlePost, 'body'),
    async (req, res, next) => {
        try {
            const { text, article } = req.body;
            const result = await linkedinService.shareArticlePost(req.user.sub, text, article);
            
            res.json({
                message: 'Article shared successfully on LinkedIn',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get LinkedIn profile info
router.get('/profile',
    checkAuth,
    async (req, res, next) => {
        try {
            const profile = await linkedinService.getProfile(req.user.sub);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    }
);

// Check if LinkedIn token is valid
router.get('/token/valid',
    checkAuth,
    async (req, res, next) => {
        try {
            const isValid = await linkedinService.isTokenValid(req.user.sub);
            res.json({ valid: isValid });
        } catch (error) {
            next(error);
        }
    }
);

// Share a post with an image on LinkedIn
router.post('/share/image',
    checkAuth,
    upload.single('image'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Image file is required' });
            }
            
            const { text, altText } = req.body;
            
            if (!text) {
                return res.status(400).json({ error: 'Text is required' });
            }
            
            const result = await linkedinService.shareImagePost(
                req.user.sub,
                text,
                req.file.buffer,
                req.file.mimetype,
                altText || ''
            );
            
            res.json({
                message: 'Image post shared successfully on LinkedIn',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

// Share a post with a video on LinkedIn
router.post('/share/video',
    checkAuth,
    upload.single('video'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Video file is required' });
            }
            
            const { text, title } = req.body;
            
            if (!text) {
                return res.status(400).json({ error: 'Text is required' });
            }
            
            const result = await linkedinService.shareVideoPost(
                req.user.sub,
                text,
                req.file.buffer,
                req.file.mimetype,
                title || ''
            );
            
            res.json({
                message: 'Video post shared successfully on LinkedIn',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

// Share a post with multiple images on LinkedIn (max 9)
router.post('/share/images',
    checkAuth,
    upload.array('images', 9),
    async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'At least one image is required' });
            }
            
            const { text } = req.body;
            // altTexts can be passed as JSON array string or as comma-separated values
            let altTexts = [];
            if (req.body.altTexts) {
                try {
                    altTexts = JSON.parse(req.body.altTexts);
                } catch {
                    altTexts = req.body.altTexts.split(',');
                }
            }
            
            if (!text) {
                return res.status(400).json({ error: 'Text is required' });
            }
            
            const images = req.files.map((file, index) => ({
                buffer: file.buffer,
                mimeType: file.mimetype,
                altText: altTexts[index] || ''
            }));
            
            const result = await linkedinService.shareMultiImagePost(
                req.user.sub,
                text,
                images
            );
            
            res.json({
                message: 'Multi-image post shared successfully on LinkedIn',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
