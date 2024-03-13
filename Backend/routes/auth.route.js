import express, { Router } from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";


const authRouter = Router();

authRouter.route('/signup').post(signup);
authRouter.route('/signin').post(signin);
authRouter.route('/google').post(google);
// authRouter.route('/googlesignup').post(googlesignup);



export default authRouter;
