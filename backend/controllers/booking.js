import Booking from "../models/booking.js";
import Show from "../models/show.js"
import stripe from 'stripe'


//function to check availablity of seat
export const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        // console.log(showData)
        
        if (!showData) {
            return false;
        }
        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        if (isAnySeatTaken) return false;
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

//create booking

export const createBooking = async (req, res) => {
    try {
        const { userId, showId, selectedSeats } = req.body;
        const { origin } = req.headers;
        // console.log(showId);
        
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.json({
                success: false,
                message: 'Selected Seats are already booked'
            })
        }
        const showData = await Show.findById(showId).populate('movie');

        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });
        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified('occupiedSeats');
        await showData.save();


        //stripe payment
        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items=[{
            price_data:{
                currency: 'usd',
                product_data:{
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount)*100
            },
            quantity:1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-bookings`,
            cancel_url:`${origin}/loading/my-bookings`,
            line_items:line_items,
            mode: 'payment',
            metadata:{
                bookingId:booking._id.toString()
            },
            expires_at: Math.floor(Date.now()/1000)+30*60,
        })

        booking.paymentLink="";
        booking.isPaid=true;
        await booking.save();
        
        return res.json({
            success: true,
            url:session.url
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const getOccupiedSeats=async (req,res) => {
    try {
        const {showId}=req.params;
        // console.log(showId);
        const showData=await Show.findById(showId);
        // console.log(showData);
        
        const occupiedSeats=Object.keys(showData.occupiedSeats);
        // console.log(occupiedSeats);
        
        return res.json({
            success: true,
            occupiedSeats
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}