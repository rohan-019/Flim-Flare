import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function HeroSections() {
  const navigate=useNavigate();
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/avenger5.jpg")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" />
      <h1 className='text-3xl md:text-[70px] md:leading-18 font-semibold max-w-110 '>Captain America: <br /> Civil War</h1>
      <div className='flex items-center gap-4 text-gray-300'>
        <span>Action | Superhero | Sci-Fi</span>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4.5 h-4.5' /> 2016
        </div>
        <div className='flex items-center  gap-1'>
          <ClockIcon className='w-4.5 h-4.5' /> 2h 27m
        </div>
      </div>
      <p className='max-wd-md text-gray-300'>Political involvement in the Avengers' affairs causes a rift between Captain America and Iron Man.</p>
      <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 bg-primary px-6 py-3 text-sm hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore More 
        <ArrowRight className='w-5 h-5'/>
      </button>
    </div>
  )
}

export default HeroSections
