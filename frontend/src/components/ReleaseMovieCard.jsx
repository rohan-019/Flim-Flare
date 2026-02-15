import { StarIcon } from 'lucide-react';
import React from 'react'
import timeFormat from '../lib/timeFormat';

function ReleaseMovieCard({movie}) {
  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:translate-y-1 transition duration-300 w-66 hover:shadow-lg shadow-primary'>
      <img 
        src={movie.backdrop_path} 
        alt={movie.title} 
        className='rounded-lg h-52 w-full object-cover object-right-bottom'
      />
      <p className='font-semibold mt-2 truncate'>{movie.title}</p>
      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} ● {movie.genres.slice(0,2).map(genre=>genre.name).join(" | ")} ● {timeFormat(movie.runtime)}
      </p>
      <div className='flex items-center justify-between mt-4 pb-3'>
        <button 
          className='px-4 py-2 text-xs bg-gray-600 cursor-not-allowed rounded-full font-medium opacity-70'
          disabled
        >
          Coming Soon
        </button>
        <p className='flex items-center gap-1'>
          <StarIcon className='w-4 h-4 text-primary fill-primary'/>
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  )
}

export default ReleaseMovieCard