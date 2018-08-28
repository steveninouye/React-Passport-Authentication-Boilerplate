// 2 part authentication module to see if user is logged in

import passport from 'passport';

// checks authenticity of token in the client's request header "Authorization": "Bearer ________"  *see /server/src/config/passport.js for example
// this basically will or will not set req.user but will not stop request
// see below function isLoggedIn to see how request is stopped
function tokenMiddleware(req, res, next) {
    passport.authenticate('bearer', { session: false })(req, res, next);
}

// checks if req.user is set
// this is done by the BearerStrategy
// if 'sessions' were used this would be created using req.login();
function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

export { tokenMiddleware, isLoggedIn };