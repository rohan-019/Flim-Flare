import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import AdminTitle from '../../components/Admin/AdminTitle';
import { dateFormat } from '../../lib/dateFormat';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';

function ListShows() {
  const currency=import.meta.env.VITE_CURRENCY
  const {backendUrl,isAdmin,isLoggedin,userData}=useContext(AppContent);
  const [shows,setShows]=useState([]);
  const [loading,setLoading]=useState(false);

  const getAllShows=async () => {
    try {
      const {data}=await axios.get(backendUrl+'/api/admin/all-shows');
      console.log(data);
      
      if(data.success){
        setShows(data.shows);
        setLoading(false);
        toast.success('Shows fetched successfully')
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
   
  useEffect(()=>{
    console.log(isAdmin ,isLoggedin);
    
    if(isAdmin && isLoggedin){
      getAllShows()
    }
  },[userData]);

  return !loading ?(
    <>
      <AdminTitle text1="List" text2="Shows"/>
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead >
            <tr className='bg-primary/50 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Total Booking</th>
              <th className='p-2 font-medium'>Earning</th>
            </tr>
          </thead>
          <tbody>
            {
              shows.map((show,index)=>(
                <tr key={index} className='border-b border-primary/10 bg-primary-dull/20 even:bg-primary/25'>
                  <td className='p-2 min-w-45'>{show.movie.title}</td>
                  <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                  <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                  <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  ) : (<Loading/>)
}

export default ListShows
