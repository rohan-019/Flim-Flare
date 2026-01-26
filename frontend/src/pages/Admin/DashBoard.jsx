import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyBookingData, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import AdminTitle from '../../components/Admin/AdminTitle';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';

function DashBoard() {
  const currency=import.meta.env.VITE_CURRENCY
  const {backendUrl,baseUrl,isLoggedin,isAdmin,userData}=useContext(AppContent);
  const [dashboardData,setDashboardData]=useState({
    totalBookings:0,
    totalRevenue:0,
    totalUser:0,
    activeShows:[],
  });
  const [loading,setLoading]=useState(true);
  const dashboardCards=[
    {title:"Total Bookings",value: dashboardData.totalBookings || '0', icon:ChartLineIcon},
    {title:"Total Revenue",value: currency + (dashboardData.totalRevenue || '0'), icon:CircleDollarSignIcon},
    {title:"Active Shows",value: dashboardData.activeShows.length || '0', icon:PlayCircleIcon},
    {title:"Total Users",value: dashboardData.totalUser || '0', icon:UsersIcon},
  ]
  const fetchDashBoardData=async () => {
    try {
      setLoading(true);
      const {data}=await axios.get(backendUrl+'/api/admin/dashboard');
      if(data.success){
        setDashboardData(data.dashboardData);
        toast.success('Dashboard Data fetched Successfully')
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }
  useEffect(()=>{
    if(isLoggedin && isAdmin){
      fetchDashBoardData();
    }
  },[userData])
  return !loading ? (
    <>
      <AdminTitle text1="Admin" text2="Dashboard"/>
      <div className='relative flex flex-wrap gap-4 mt-6'>
        <BlurCircle top="-100px" left="0"/>
        <div className='flex flex-wrap gap-4 w-full'>
          {
            dashboardCards.map((card,index)=>(
              <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/50 rounded-md max-w-50 w-full shadow-lg ring-2 ring-primary/40 hover:scale-95 transition'>
                <div>
                  <h1 className='text-sm'>{card.title}</h1>
                  <p>{card.value}</p>
                </div>
                <card.icon className='w-6 h-6'/>
              </div>
            ))
          }
        </div>
      </div>
      <p className='mt-10 text-lg font-medium'>Active Shows</p>
      <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl'>
          <BlurCircle top='100px' left='-10%'/>
          {
            dashboardData.activeShows.map((show)=>(
              <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:translate-y-1 hover:shadow-[0_4px_24px_rgba(139,92,246,0.5)]  transition duration-300'>
                <img src={baseUrl+show.movie.poster_path} alt="" className='h-60 w-full object-cover'/>
                <p className='font-medium p-2 truncate'>{show.movie.title}</p>
                <div className='flex items-center justify-between px-2'>
                  <p className='text-lg font-medium'>
                    {currency} {show.showPrice}
                  </p>
                  <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 fill-primary text-primary'/>
                    {show.movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormat(show.showDateTime)}</p>
              </div>
            ))
          }
      </div>
    </>
  ) : <Loading/>
}

export default DashBoard
