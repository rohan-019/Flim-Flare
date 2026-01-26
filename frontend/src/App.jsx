import React, { useContext } from 'react'
import NavBar from './components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/Admin/Layout'
import DashBoard from './pages/Admin/DashBoard'
import AddShow from './pages/Admin/AddShow'
import ListBookings from './pages/Admin/ListBookings'
import ListShows from './pages/Admin/ListShows'
import AiAssitance from './pages/AiAssitance'
import LoginPage from './pages/LoginPage'
import ResetPassword from './pages/ResetPassword'
import { AppContent } from './context/AppContext'
import Loading from './components/Loading'

function App() {
  const {userData,backendUrl,setUserData,isLoggedin,setIsLoggedin,isAdmin} = useContext(AppContent);
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const isLoginRoute=useLocation().pathname.startsWith('/login');
  const isResetPasswordRoute=useLocation().pathname.startsWith('/reset-password');
  
  return (
    <>
      <Toaster />
      {!isAdminRoute && !isLoginRoute && !isResetPasswordRoute && <NavBar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path='/ask-ai' element={<AiAssitance/>}/>
        <Route path='/admin/*' element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path='add-shows' element={<AddShow />} />
          <Route path='list-bookings' element={<ListBookings />} />
          <Route path='list-shows' element={<ListShows />} />
        </Route>
      </Routes>
      {!isAdminRoute && !isLoginRoute && !isResetPasswordRoute && <Footer />}
    </>
  )
}

export default App
