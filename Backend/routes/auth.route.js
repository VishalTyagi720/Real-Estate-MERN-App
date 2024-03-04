import express, { Router } from "express";
import { signup } from "../controllers/auth.controller.js";


const authRouter = Router();

authRouter.route('/signup').post(signup);


export default authRouter;
