'use client';  // This line makes the component a Client Component

import { FaSignInAlt } from 'react-icons/fa'; // Import icons from react-icons
import { BsFillExclamationCircleFill } from 'react-icons/bs';

export default function Home() {
  return (
    <div 
      className="relative bg-cover bg-center h-screen flex items-center justify-center" 
      style={{ backgroundImage: 'url("background.jpg")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-bold mb-4 mt-20">Welcome to TrashTronix!</h1>
        <p className="text-lg mb-8">
          "Transforming waste into value. Smarter, cleaner, and sustainable cities with intelligent <br /> waste management solutions..."
        </p>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="flex items-center justify-center bg-transparent border border-gray-400 rounded-full text-white text-lg font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:bg-white hover:text-black"
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '15px 30px',
              width: '40%',
              marginRight: '20px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
              boxShadow: '0 6px 10px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.2)',
              fontSize: '18px', // Font size for the button text
            }}
          >Login  &nbsp;<FaSignInAlt/> {/* Adjusted margin for Login Icon */}
          </button>
          <button
            className="flex items-center justify-center bg-transparent border border-gray-400 rounded-full text-white text-lg font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:bg-white hover:text-black"
            onClick={() => window.location.href = '/complaint'}
            style={{
              padding: '15px 30px',
              width: '40%',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
              boxShadow: '0 6px 10px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.2)',
              fontSize: '18px', // Font size for the button text
            }}
          >
            Register Complaint  &nbsp;
            <BsFillExclamationCircleFill/> {/* Adjusted margin for Register Complaint Icon */}
            
          </button>
        </div>
      </div>
    </div>
  );
}
