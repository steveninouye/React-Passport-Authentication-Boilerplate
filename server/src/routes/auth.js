import { Router } from 'express';
import passport from 'passport';
import { encode } from '../utils/tokens';

let router = Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, token, info) => {
        // if server/database error occurs
        if (err) {
            console.log(err);
            return res.sendStatus(500);

        // if no token given by local strategy (usually due to unauthorized user)
        } else if (!token) {
            return res.status(401).json(info);

        // all other reasons (user is valid and localStrategy gives token) user will be authenticated and give token to user/client
        } else {
            return res.status(201).json(token);
        }
    })(req, res, next);
});

export default router;