import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../../../config/config.js';

import Users from '../../services/user.service.js';
const userService = new Users();

const callbackURL = config.googleCallbackURL || "/auth/google/callback";



 const googleStrategy = new GoogleStrategy({
    clientID: config.googleId,
    clientSecret: config.googleSecret,
    callbackURL: callbackURL
  },
async (accessToken, refreshToken, profile, done) => {
try {

  console.log('Google profile:', profile );

  const email = profile.emails[0].value;
  const googleId = profile.id;

  let user = null ;


  user = await userService.getUserByEmail(email);

  if (user) {
                // User exists - update googleId if not set
            if (!user.googleId) {
                user = await userService.updateUser(user.id, {
                    googleId: googleId,
                            name: profile.displayName,
          email: profile.emails[0].value,

                });
            }
  }else{

      user = await userService.createUser({
        name: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
    });
  }

    console.log('New user created:', user  );
    
    
    return done(null, user);
} catch (error) {
  console.error(error);
  
    done(error, null);
}
  }
);

 export default googleStrategy;