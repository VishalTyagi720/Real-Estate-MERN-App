import { Router } from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const listingRouter = Router();

listingRouter.route('/create').post(verifyJWT, createListing);



export default listingRouter;