import expreess from 'express'
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/admin.js'
import adminAuth from '../middleswares/adminAuth.js';

const adminRouter=expreess.Router()

adminRouter.get('/is-admin',adminAuth,isAdmin);
adminRouter.get('/dashboard',adminAuth,getDashboardData);
adminRouter.get('/all-shows',adminAuth,getAllShows);
adminRouter.get('/all-bookings',adminAuth,getAllBookings);


export default adminRouter;