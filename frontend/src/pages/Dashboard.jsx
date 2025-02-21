import React, { useState } from 'react'
import Sidebar from '../components/Dashboard/Sidebar'
import Nav from '../components/Dashboard/Nav'
import { Outlet } from 'react-router-dom'

const DashboardStudent = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <div className="flex-1 ml-16 transition-all duration-300">
        <Nav />
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardStudent

