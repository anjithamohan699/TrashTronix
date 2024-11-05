'use client';  // This line makes the component a Client Components

import { useState } from 'react';
import { auth } from '../../lib/firebase'; // Import auth from your lib/firebase.js file
import { sendPasswordResetEmail } from 'firebase/auth';
import { IoIosLock } from "react-icons/io";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to handle the password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      // Send password reset email via Firebase
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
    } catch (err) {
      // Handle errors, such as invalid email or user not found
      setError('Error resetting password. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      {/* Rotated Background Div - opposite direction */}
      <div className="absolute w-[350px] h-[370px] bg-[#393269] rounded-lg transform -rotate-3 shadow-lg"></div>

      {/* Main Password Reset Card - same size as the rotated box */}
      <div className="relative bg-white shadow-xl rounded-lg p-8 w-[350px] h-[370px]">
        <div className="flex flex-col items-center">
          <div className="bg-[#393269] rounded-full p-3 mb-4">
            {/* Replace SVG with FaLock Icon */}
            <IoIosLock color="white" size={36}/>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-black">Forgot Your Password?</h2>
          <p className="text-gray-600 mb-6 text-center text-black">
            No worries! Enter your email, and we will send you a reset password
            link.
          </p>
        </div>

        {/* Form for handling password reset */}
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#393269] text-black"
              placeholder="email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#393269] text-white py-2 rounded-lg hover:bg-[#5A41C7] transition duration-200"
          >
            Send Request
          </button>
        </form>

        {/* Display success or error message */}
        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
