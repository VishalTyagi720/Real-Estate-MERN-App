import express, { Router } from 'express';
import { test, updateUser, deleteUser, getUserListing } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const userRouter = Router();
// router.get('/test', test);

userRouter.route('/test').get(test);
userRouter.route('/update/:id').post(verifyJWT, updateUser);
userRouter.route('/delete/:id').delete(verifyJWT, deleteUser);
userRouter.route('/listings/:id').get(verifyJWT, getUserListing);


export default userRouter;
