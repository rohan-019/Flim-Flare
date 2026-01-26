import express from 'express'
import { createBooking, getOccupiedSeats } from '../controllers/booking.js'
import userAuth from '../middleswares/userAuth.js';

const bookingRouter=express.Router();

bookingRouter.post('/create',userAuth,createBooking);
bookingRouter.post('/seats/:showId',getOccupiedSeats);

export default bookingRouter;