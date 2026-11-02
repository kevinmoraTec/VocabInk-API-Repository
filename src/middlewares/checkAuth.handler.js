import boom from '@hapi/boom';
import AuthService from '../services/auth.service.js';

const authService = new AuthService();


/**
 * Middleware to check if user is authenticated via JWT
 */

export const checkAuth = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        
        if (!token) {
      throw boom.unauthorized('No token provided');
        }

        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();

    } catch (error)     {
        next(error);
    }
};