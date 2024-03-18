import express, { Router } from "express";
import { google, signin, signup, logout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const authRouter = Router();

authRouter.route('/signup').post(signup);
authRouter.route('/signin').post(signin);
authRouter.route('/google').post(google);
// authRouter.route('/googlesignup').post(googlesignup);
authRouter.route('/logout').post(verifyJWT, logout);




export default authRouter;
