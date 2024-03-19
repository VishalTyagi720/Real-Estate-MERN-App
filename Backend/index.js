import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';


const app = express();

// app.use(cors());

app.use(express.json()); //Parse incoming requests data as JSON. Using this we can send data to the server. Bu default it is not allowed

app.use(cookieParser());

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log(error);
})


app.listen('3000', () => {
    console.log('Server is running on port 3000!!!');
})


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const success = err.success;
    return res.status(statusCode).json({
        success,
        statusCode,
        message,
    });
});












// username : vishalsinghx00
// password : Vishal752002