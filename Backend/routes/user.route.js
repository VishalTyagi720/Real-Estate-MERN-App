import express from 'express';
import { Router } from 'express';
import { test } from '../controllers/user.controller.js';


const router = Router();


// router.get('/test', test);

router.route('/test').get(test);


export default router;