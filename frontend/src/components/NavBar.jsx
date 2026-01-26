import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { BrainIcon, HeartIcon, MenuIcon, SearchIcon, Ticket, TicketPlus, XIcon } from 'lucide-react'
import { AppContent } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

function NavBar() {
  const [isOpen,setIsOpen]=useState(false);
  const navigate=useNavigate();

  const {userData,backendUrl,setUserData,setIsLoggedin}=useContext(AppContent);

  const logout=async () => {
    try {
      const {data}=await axios.get(backendUrl+'/api/user/logout');
      
      if(data.success){
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-2 lg:px-36 py-5'> 
        {/* logo */}
      <Link to='/' className='max-md:flex-1 '>
        <img src={assets.flimflare} alt="" className='w-36 h-auto backdrop-blur bg-white/10 border border-white/20 rounded-full p-2 shadow-md'/>
      </Link>

      {/* menu items */}
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center
        max-md:justify-center gap-4 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-200/20 
        overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
        <XIcon onClick={()=>setIsOpen(!isOpen)} className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'/>
        <Link to="/" onClick={()=>{scrollTo(0,0);setIsOpen(!isOpen)}} className='text-sm'>Home</Link>
        <Link to="/movies" onClick={()=>{scrollTo(0,0);setIsOpen(!isOpen)}} className='text-sm'>Movies</Link>
        <Link to="/" onClick={()=>{scrollTo(0,0);setIsOpen(!isOpen)}} className='text-sm'>Theaters</Link>
        <Link to="/" onClick={()=>{scrollTo(0,0);setIsOpen(!isOpen)}} className='text-sm'>Releases</Link>
        <Link to="/my-bookings" onClick={()=>{scrollTo(0,0);setIsOpen(!isOpen)}} className='text-sm'>Bookings</Link>
        <Link to="/ask-ai" onClick={()=>{scrollTo(0,0);setIsOpen(!isOpen)}} className='flex items-center gap-1'>
          <SearchIcon className='color-primary w-4 h-4 mb-1' strokeWidth={2}/>
          <p className='text-sm font-semi-bold text-white md:hidden lg:block'><span className='text-yellow-400'>AI</span> Assist</p>
        </Link>
      </div>
      
        {/* login and search */}
      <div className='flex items-center gap-8 '>
        {/* <SearchIcon className='max-md:hidden w-9 h-9 cursor-pointer backdrop-blur bg-white/10 border border-white/20 rounded-full p-1 shadow-md'/> */}
        
        <Link to="/favorite" onClick={()=>{scroll(0,0)}}>
          <HeartIcon className='w-7 h-7 text-gray-300 fill-primary hover:scale-95 transition ' strokeWidth={1}/>
        </Link>
        {
            !userData ? (<button onClick={()=>navigate('/login')} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>) : 
            (<button onClick={logout} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Logout</button>)
        }
      </div>

      {/* menu icon for mobile */}
      <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=>setIsOpen(!isOpen)}/>
    </div>
  )
}

export default NavBar
