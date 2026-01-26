import { StarIcon } from 'lucide-react';
import React, { useContext } from 'react'
import timeFormat from '../lib/timeFormat';
import { AppContent } from '../context/AppContext';

function Card({movie}) {
    const { baseUrl } = useContext(AppContent);
    return (
        <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:translate-y-1 transition duration-300 w-66  hover:shadow-lg shadow-primary'>
      <img src={baseUrl+movie.backdrop_path} alt="" className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer'/>
      <p className='font-semibold mt-2 truncate'>{movie.title}</p>
      <p className='text-sm text-gray-400 mt-2'>{new Date(movie.release_date).getFullYear()} ● {movie.genres.slice(0,2).map(genre=>genre.name).join(" | ")} ● {timeFormat(movie.runtime)}</p>
      <div className='flex items-center justify-between mt-4 pb-3'>
        <p>
            <StarIcon className='w-4 h-4 text-primary fill-primary'/>
            {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
    )
}

export default Card
