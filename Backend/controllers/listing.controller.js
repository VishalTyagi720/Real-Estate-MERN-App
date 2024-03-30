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


export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) ||  9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        let furnished = req.query.furnished;
        let parking = req.query.parking
        let type = req.query.type

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        if(furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] }
        }

        if(parking === undefined || parking === 'false') {
            parking = { $in: [false, true] }
        }

        if(type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort({[sort]: order}).limit(limit).skip(startIndex);

        return res.status(200).json(new ApiResponse(200, listings, 'Successfully retrieved the listings'));

    } catch (error) {
        next(new ApiError(500, "Server Error"))
    }
};