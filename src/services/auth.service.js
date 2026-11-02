import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.jwtExpiration = process.env.JWT_EXPIRATION || '7d';
    }

    /**
     * Generates a JWT token for a user
     * @param {Object} user - User object from Google profile
     * @returns {string} JWT token
     */
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.emails?.[0]?.value,
            name: user.displayName,
            picture: user.photos?.[0]?.value
        };

        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiration
        });
    }

    /**
     * Verifies a JWT token
     * @param {string} token - JWT token to verify
     * @returns {Object} Decoded token payload
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw boom.unauthorized('Invalid token');
        }
    }
}

export default AuthService;