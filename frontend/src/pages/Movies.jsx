import React, { useContext, useEffect, useState } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import SplashCursor from '../components/SplashCursor'
import { AppContent } from '../context/AppContext'
import toast from 'react-hot-toast'
import axios from 'axios'

function Movies() {
  const {shows}=useContext(AppContent);

  return shows.length>0 ?(
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] pb-5'>
      {/* <SplashCursor/> */}
      <BlurCircle top='150px' left='0px'/>
      <BlurCircle bottom='50px' right='50px'/>
      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap gap-6 max-sm:justify-center'>
        {shows.map((movie)=>(
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No Movies Available . . .</h1>
    </div>
  )
}

export default Movies
