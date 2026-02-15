import React, { useState } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import SplashCursor from '../components/SplashCursor'

function Release() {
  const [movies] = useState([
    {
      _id: '1',
      title: 'Dune: Part Two',
      backdrop_path: 'https://images.justwatch.com/poster/311750830/s718/dune-part-two.jpg',
      release_date: '2024-03-01',
      genres: [
        { name: 'Sci-Fi' },
        { name: 'Adventure' }
      ],
      runtime: 166,
      vote_average: 8.5
    },
    {
      _id: '2',
      title: 'Deadpool & Wolverine',
      backdrop_path: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/09/review-deadpool-wolverine-is-the-awesome-movie-going-experience-we-all-hoped-for.jpg',
      release_date: '2024-07-26',
      genres: [
        { name: 'Action' },
        { name: 'Comedy' }
      ],
      runtime: 128,
      vote_average: 7.8
    }
  ])

  return movies.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] pb-5'>
      <SplashCursor/>
      <BlurCircle top='150px' left='0px'/>
      <BlurCircle bottom='50px' right='50px'/>
      <h1 className='text-lg font-medium my-4'>New Releases</h1>
      <div className='flex flex-wrap gap-6 max-sm:justify-center'>
        {movies.map((movie)=>(
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <SplashCursor/>
      <h1 className='text-3xl font-bold text-center'>No Movies Available . . .</h1>
    </div>
  )
}

export default Release