import React from 'react'
import AdminNavbar from '../../components/Admin/AdminNavbar'
import { Sidebar } from 'lucide-react'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import { Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AppContent } from '../../context/AppContext'
import { useEffect } from 'react'
import Loading from '../../components/Loading'

function Layout() {
  const {isAdmin,fetchIsAdmin}=useContext(AppContent);


  useEffect(()=>{
    fetchIsAdmin();
  },[isAdmin]);


  return isAdmin ? (
    <>
      <AdminNavbar/>
      <div className='flex'>
        <AdminSidebar/>
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet/>
        </div>
      </div>
    </>
  ) : (<Loading/>)
}

export default Layout
