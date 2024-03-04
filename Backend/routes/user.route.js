import express, { Router } from 'express';
import { test } from '../controllers/user.controller.js';


const userRouter = Router();
// router.get('/test', test);

userRouter.route('/test').get(test);


export default userRouter;
