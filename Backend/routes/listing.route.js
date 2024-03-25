import { Router } from 'express';
import { createListing, deleteListing, updateListing } from '../controllers/listing.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const listingRouter = Router();

listingRouter.route('/create').post(verifyJWT, createListing);
listingRouter.route('/delete/:id').delete(verifyJWT, deleteListing);
listingRouter.route('/update/:id').post(verifyJWT, updateListing);



export default listingRouter;