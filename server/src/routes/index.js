import { Router } from 'express';
import peopleRouter from './people';
import classesRouter from './classes';
import authRouter from './auth';
import usersRouter from './users';
import { isLoggedIn, tokenMiddleware } from '../middleware/auth.mw';

let router = Router();

router.use('/auth', authRouter);

// only POST, PUT, AND DELETE routes blocked by middleware (checking for authentication)
// GET requests are allowed to make requests without authentication (deny of GET requests can be added)
router
    .route('*')
    .post(tokenMiddleware, isLoggedIn)
    .put(tokenMiddleware, isLoggedIn)
    .delete(tokenMiddleware, isLoggedIn);

router.use('/classes', classesRouter);
router.use('/people', peopleRouter);
router.use('/users', usersRouter);

export default router;
