import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import connectDB from './configs/db.js';
// import { clerkMiddleware } from '@clerk/express'
import  cookieParser from 'cookie-parser'
import userRouter from './routes/user.js';
import showRouter from './routes/show.js';
import bookingRouter from './routes/booking.js';
import adminRouter from './routes/admin.js';
import { stripeWebhooks } from './controllers/stripeWebhook.js';


const app=express();
const PORT=process.env.PORT || 5000;
const allowedOrigins=process.env.FRONTEND_ORIGIN

await connectDB();

//stripe webhook
app.use('/api/stripe',express.raw({type: 'application/json'}), stripeWebhooks);


//middleware
app.use(express.json());
app.use(cors({
    origin:allowedOrigins,
    credentials:true
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));




//api routes
app.get('/',(req,res)=>res.send('Server is Live!'));
app.use('/api/user',userRouter);
app.use('/api/show',showRouter);
app.use('/api/booking',bookingRouter);
app.use('/api/admin',adminRouter);
// app.use('/api/gemini',searchRouter);

app.listen(PORT,()=>console.log('Server started at',PORT));
