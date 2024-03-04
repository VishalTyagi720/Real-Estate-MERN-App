import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


const app = express();

app.use(express.json()); //Parse incoming requests data as JSON. Using this we can send data to the server. Bu default it is not allowed


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












// username : vishalsinghx00
// password : Vishal752002