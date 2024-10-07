import { Bars3Icon, UserCircleIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Import UserPlusIcon
import { useState } from 'react';

export default function Navbar({ setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <nav className="bg-[#393269] text-white p-4 flex justify-between items-center shadow-md">

      {/* Hamburger Icon */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="focus:outline-none"
      >
        <Bars3Icon className="h-6 w-6 text-white" />
      </button>

      {/* Logo / Title */}
      <div className="text-xl font-bold">Trashtronix Admin</div>

      {/* Icons on the Right */}
      <div className="flex items-center">
        {/* User Plus Icon */}
        <button className="mx-3" onClick={() => setFormOpen(!formOpen)}>
          <UserPlusIcon className="h-8 w-8 text-white" /> {/* Adjusted to h-8 w-8 */}
        </button>

        {/* Account Icon */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <UserCircleIcon className="h-8 w-8 text-white mt-2" />
          </button>

          {/* Dropdown for Account */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#8DD8CC] rounded-lg shadow-lg py-2">
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</a>
            </div>
          )}
        </div>
      </div>

      {/* Form Dropdown */}
      {formOpen && (
        <div className="absolute right-12 top-20 mt-2 w-72 bg-gray-300 rounded-lg shadow-lg p-4 z-20">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Add User</h2>
            <button onClick={() => setFormOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
          </div>
          <form className="space-y-3 mt-2">
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black" 
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black" 
            />
            <input 
              type="tel" 
              placeholder="Phone" 
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black" 
            />
            <select className="w-full px-3 py-2 border border-gray-400 rounded-md text-black">
              <option value="staff">Staff</option>
              {/* Add more roles if needed */}
            </select>
            <button 
              type="submit" 
              className="w-full bg-[#228B22] text-white py-2 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
