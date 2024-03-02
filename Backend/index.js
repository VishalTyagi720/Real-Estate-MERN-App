import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';


const app = express();

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log(error);
})


app.use('/api/user', userRouter);


app.listen('3000', () => {
    console.log('Server is running on port 3000!!!');
})










// username : vishalsinghx00
// password : Vishal752002