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


export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new ApiError(404, 'Listing not found'))
    }
    if (req.user.id !== listing.userRef) {
        return next(new ApiError(401, 'You can only delete your own listings...'))
    }

    try {
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);

        return res.status(200)
        .json(new ApiResponse(200, deletedListing,'listing deleted successfully'))
        
    } catch (error) {
        next(new ApiError(500, error.message))
    }
};


export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        next(new ApiError(404, 'Listing not found'))
    }

    if (req.user.id !== listing.userRef) {
        return next(new ApiError(401, 'You can only update your own listings...'))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});

        return res.status(200).json(new ApiResponse(200, updatedListing, 'User listing updated successfully'))
        
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};


export const getListing = async (req, res, next) => {
    try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        next(new ApiError(404, 'Listing not found'))
    }

    return res.status(200).json(new ApiResponse(200, listing, 'listing get successfully'))
        
    } catch (error) {
        next(new ApiError(500, "Server Error"));
    }
};