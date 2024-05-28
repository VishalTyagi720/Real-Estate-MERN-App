import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch (error) {
        next(new ApiError(500, "Something went wrong while generating refresh and access token"))
    }
}


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
    }
};


export const signin = async (req, res, next) => {
    const {username, email, password} = req.body;
    try {
        const validUser = await User.findOne({
            $or: [{username}, {email}]
        })
        if (!validUser) {
            return next(new ApiError(404, "User not found!!"))
        }
        const isPasswordValid = bcryptjs.compareSync(password, validUser.password);
        if(!isPasswordValid){
            return next(new ApiError(401, "Wrong credentials!!"))
        }
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(validUser._id);
        const loggedInUser = await User.findById(validUser._id).select("-refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        // .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in Successfully"))
        .json(new ApiResponse(200, loggedInUser, "User logged in Successfully"))

    } catch (error) {
        next(new ApiError(403, 'Authentication failed'));
    }
};


export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
            const loggedInUser = await User.findById(user._id).select("-_id -password -refreshToken")

            const options = {
                httpOnly: true,
                secure: true
            }

            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, loggedInUser, "User logged in Successfully"))
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowercase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const {accessToken, refreshToken} = await generateAccessAndRefreshToken(newUser._id);
            const SignedInUser = await User.findById(newUser._id).select("-_id -password -refreshToken")

            const options = {
                httpOnly: true,
                secure: true
            }

            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, SignedInUser, "User Signed up Successfully"))
            // alert('User not found. Plz register');  //Add notification instead
        }
    } catch (error) {
        next(new ApiError('500',))
    }
};


// export const googlesignup = async (req, res, next) => {
//     try {
//         const user = await User.findOne({email: req.body.email})
//         if (!user) {
//             const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
//             const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
//             const newUser = new User({
//                 username: req.body.name.split(" ").join("").toLowercase() + Math.random().toString(36).slice(-4),
//                 email: req.body.email,
//                 password: hashedPassword,
//                 avatar: req.body.photo,
//             });
//             await newUser.save();
//             const {accessToken, refreshToken} = await generateAccessAndRefreshToken(newUser._id);
//             const SignedInUser = await User.findById(newUser._id).select("-_id -password -refreshToken")

//             const options = {
//                 httpOnly: true,
//                 secure: true
//             }

//             return res.status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", refreshToken, options)
//             .json(new ApiResponse(200, SignedInUser, "User Signed up Successfully"))
//         }
//         else {
//             alert('User already exist') //Add notification instead

//         }
//     } catch (error) {
//         next(new ApiError('500',))
//     }
// };


export const logout = async (req, res, next) => {
    try {
        const logedoutUser = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                refreshToken: null
            }},
            {
                new: true, //return the updated document
            }
        ).select('-password')
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, logedoutUser, "User logged Out"))
        
    } catch (error) {
        next(new ApiError(500, 'Unable to logout Try again...'))
    }
};