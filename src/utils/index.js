import passport from 'passport';
import googleStrategy from './strategies/google.auth.strategie.js';
import linkedinStrategy from './strategies/linkedin.auth.strategie.js';




passport.use(googleStrategy);
passport.use(linkedinStrategy);

// passport.serializeUser((user, done) => {
//     // In a real application, you would serialize only the user ID
//     done(null, user.id);
// });

// passport.deserializeUser((obj, done) => {
//     // In a real application, you would look up the user in the database here
//     done(null, obj);
// }); 



export default passport;