import React from 'react'
import HeroSections from '../components/HeroSections'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailerSection'
import SplashCursor from '../components/SplashCursor'

function Home() {
  return (
    <>
      {/* <SplashCursor/> */}
      <HeroSections/>
      <FeaturedSection/>
      <TrailerSection/>
    </>
  )
}

export default Home
