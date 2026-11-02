import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { config } from '../../../config/config.js';
import Users from '../../services/user.service.js';

const userService = new Users();

const linkedinStrategy = new OAuth2Strategy({
    authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientID: config.linkedinClientId,
    clientSecret: config.linkedinClientSecret,
    callbackURL: config.linkedinCallbackURL,
    scope: ['openid', 'profile', 'email', 'w_member_social'],
    passReqToCallback: true
},
async (req, accessToken, refreshToken, params, profile, done) => {
    try {
        console.log('LinkedIn OAuth params:', params);
        
        // Fetch user profile from LinkedIn using the access token
        const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!userInfoResponse.ok) {
            throw new Error(`Failed to fetch LinkedIn profile: ${userInfoResponse.status}`);
        }
        
        const linkedinProfile = await userInfoResponse.json();
        console.log('LinkedIn profile:', linkedinProfile);
        
        const email = linkedinProfile.email;
        const linkedinId = linkedinProfile.sub;
        const name = linkedinProfile.name || `${linkedinProfile.given_name || ''} ${linkedinProfile.family_name || ''}`.trim();

        // Get user from the session/token (they should already be logged in)
        const userId = req.user?.sub;

        if (userId) {
            // User is linking their LinkedIn account during onboarding
            const user = await userService.updateUser(userId, {
                linked_in_id: linkedinId,
                linkedin_access_token: accessToken,
                linkedin_refresh_token: refreshToken
            });
            return done(null, { ...user.dataValues, linkedinConnected: true });
        }

        // Fallback: user not logged in, find or create by email
        let user = await userService.getUserByEmail(email);

        if (user) {
            if (!user.linked_in_id) {
                user = await userService.updateUser(user.id, {
                    linked_in_id: linkedinId,
                    linkedin_access_token: accessToken,
                    linkedin_refresh_token: refreshToken
                });
            }
        } else {
            user = await userService.createUser({
                name: name,
                email: email,
                linked_in_id: linkedinId,
                linkedin_access_token: accessToken,
                linkedin_refresh_token: refreshToken
            });
        }

        return done(null, user);
    } catch (error) {
        console.error('LinkedIn auth error:', error);
        done(error, null);
    }
});

// Set the strategy name to 'linkedin'
linkedinStrategy.name = 'linkedin';

export default linkedinStrategy;
