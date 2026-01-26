import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import AdminTitle from '../../components/Admin/AdminTitle';
import { dateFormat } from '../../lib/dateFormat';
import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function ListBookings() {
  const currency = import.meta.env.VITE_CURRENCY;
  const {backendUrl,userDta,isLoggedin,isAdmin}=useContext(AppContent);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchBookingData = async() => {
    try {
      const {data}=await axios.get(backendUrl+'/api/admin/all-bookings');
      if(data.success){
        setBookings(data.bookings);
        setIsLoading(false);
        toast.success('Booking Data fetched Successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    fetchBookingData();
  }, [])
  return !isLoading ? (
    <div>
      <AdminTitle text1="List" text2="Bookings" />
      <div className='max-w-4xl  mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/50 text-left text-white'>
              <th className='p-2 font-medium pl-5'>User Name</th>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              bookings.map((booking, index) => (
                <tr key={index} className='border-b border-primary/10 bg-primary-dull/20 even:bg-primary/25'>
                  <td className='p-2 min-w-45'>{booking.user.name}</td>
                  <td className='p-2'>{booking.show.movie.title}</td>
                  <td className='p-2'>{dateFormat(booking.show.showDateTime)}</td>
                  <td className='p-2'>{Object.keys(booking.bookedSeats).map(seat=>booking.bookedSeats[seat]).join(", ")}</td>
                  <td className='p-2'>{currency} {booking.amount}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  ) : (< Loading />)
}

export default ListBookings
