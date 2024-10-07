// src/app/admin/page.js
"use client"
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useState } from 'react';
import Statistics from '../../components/Statistics'; // Import the Statistics component

export default function page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />
<div >
        

          {/* Statistics Section */}
          <Statistics />
        </div>
      </div>
    </div>
  );
}
