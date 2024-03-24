import { Router } from 'express';
import { createListing, deleteListing } from '../controllers/listing.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const listingRouter = Router();

listingRouter.route('/create').post(verifyJWT, createListing);
listingRouter.route('/delete/:id').delete(verifyJWT, deleteListing);



export default listingRouter;