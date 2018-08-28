import { Router } from 'express';
import { tokenMiddleware, isLoggedIn } from '../middleware/auth.mw';

let router = Router();

// shows how middleware (checking for authentication) can be added for specific routes
router.get('/me', tokenMiddleware, isLoggedIn, (req, res) => {
    res.json(req.user);
});

export default router;