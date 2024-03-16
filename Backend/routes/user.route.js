import express, { Router } from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const userRouter = Router();
// router.get('/test', test);

userRouter.route('/test').get(test);
userRouter.route('/update/:id').post(verifyJWT, updateUser);


export default userRouter;
