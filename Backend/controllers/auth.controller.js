import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const encryptedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({username, email, password: encryptedPassword})
    try {
        await newUser.save()
        // res.status(201).json('New User Created Successfully');
        res.status(201).json(new ApiResponse(200, newUser, 'New User Created Successfully'));
    }
    catch (error) {
        // next(error);  // for using the middleware
        next(new ApiError(500, 'This username or email already exists'));
        // throw new ApiError(500, 'Duplicate user');
    }
};

