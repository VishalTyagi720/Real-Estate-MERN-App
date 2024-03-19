import ApiError from "../utils/ApiError.js";
import Listing from "../models/listing.model.js";
import ApiResponse from "../utils/ApiResponse.js";


export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        if (!listing) {
            next(new ApiError(400, 'Listing not available.. Try again'))
            return;
        };

        return res.status(200).json(new ApiResponse(201, listing, 'Listing Created Successfully'));

    } catch (error) {
        next(new ApiError(500, error.message));
    }
};