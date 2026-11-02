import express from 'express';
const router = express.Router();
import passportCofig from '../utils/index.js';
import AuthService from '../services/auth.service.js';
const authService = new AuthService();
import { config } from '../../config/config.js';
import UsersService from '../services/user.service.js';
const userService = new UsersService();


router.get('/', (req, res) => {

    res.send('<a href="/v1/auth/google">Login with Google</a>');
});

router.get('/google',
        passportCofig.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passportCofig.authenticate('google', {
         failureRedirect: '/login',
          session: false
         }),
    (req, res,next) => {
                try {
            
        // Generate JWT token
            const token = authService.generateToken(req.user);

            // User data to send
            const userData = {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                //picture: req.user.picture
            };

                // Set token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: config.env === 'production', // Only HTTPS in production
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            
            // Redirect to frontend with user data
            const redirectUrl = `${config.frontendURL}/auth/callback?user=${encodeURIComponent(JSON.stringify(userData))}`;

            console.log('Send this to my frontend Login');
            console.log(redirectUrl);
            console.log('User Data');
            console.log(userData);
            
            
            
            res.redirect(redirectUrl);
    }catch (error) {
            next(error);   
        }
    });


router.get('/verify', async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                authenticated: false,
                message: 'No token provided' 
            });
        }

        const decoded = authService.verifyToken(token);

        console.log('I return this:');
        console.log(decoded);

        const userData = await userService.getUserById(decoded.sub);

        // console.log('User data :');
        // console.log(userData);
        
        res.json({
            authenticated: true,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                //picture: userData.picture
            },
            onboarding_completed: userData.onboarding_completed || false,
            onboarding_data: userData.profile_config || {}
      });
    } catch (error) {
        next(error);
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

export default router;