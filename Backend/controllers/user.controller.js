import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";



export const test = (req, res) => {
    res.json({
        message: "Hello World",
    });
};


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(new ApiError(401, 'You can only update your own profile'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar,
            }
        }, {new : true}).select('-password');

        return res.status(200)
        .json(new ApiResponse(200, updatedUser, "Account Details updated successfully"))

    } catch (error) {
        next(new ApiError(500, 'Something went wrong while updating the user'));
    }
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(new ApiError(401, 'You can only delete your own profile'));
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        // res.clearCookie('refreshToken', options)
        // res.clearCookie('accessToken', options)

        return res.status(200)
        .clearCookie('refreshToken', options)
        .clearCookie('accessToken', options)
        .json(new ApiResponse(200, deletedUser, 'User has been deleted successfully'))

        
    } catch (error) {
        next(new ApiError(500, 'Something went wrong while deleting the user'))
    }
};


export const getUserListing = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(new ApiError(401, 'You can only view your own listing'));
    }

    try {
        const listings = await Listing.find({userRef: req.params.id});

        return res.status(200)
        .json(new ApiResponse(200, listings, 'listing fetched successfully'))
        
    } catch (error) {
        next(new ApiError(500, 'Something went wrong while fetching the list'))
    }
};