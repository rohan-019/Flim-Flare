import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

function AdminNavbar() {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
      <Link to="/">
        <img src={assets.flimflare} alt="logo" className='w-36 h-auto backdrop-blur bg-white/10 border border-white/20 rounded-full p-2 shadow-md'/>
      </Link>
    </div>
  )
}

export default AdminNavbar
