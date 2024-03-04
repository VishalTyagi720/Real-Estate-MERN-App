import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


export const signup = async (req, res) => {
    // console.log(req.body);
    const {username, email, password} = req.body;
    const encryptedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({username, email, password: encryptedPassword})
    try {
        await newUser.save()
        res.status(201).json('New User Created Successfully');
    }
    catch (error) {
        res.status(500).json(error.message)
    }
};
