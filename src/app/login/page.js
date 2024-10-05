// login/page.js
'use client';
import { useState } from  'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log('Logged in user:', user.uid);
  
      // Fetch role from Firestore (assuming role is stored under a collection called 'admin')
      const userDoc = await getDoc(doc(db, 'admin', user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log('User role:', role);
  
        // Redirect based on role
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'staff') {
          router.push('/staff');
        } else {
          router.push('/user');
        }
      } else {
        console.error('No such document!');
        setError('User role not found');
      }
    } catch (error) {
      console.error('Login Error:', error);  // This will log the detailed error
      setError('Invalid email or password');
    }
  };  

  return (
    <div className="flex h-screen bg-[#393269]">
      {/* Left Section with Image */}
      <div className="hidden md:flex w-2/5 bg-[#393269] justify-center items-center">
        <img src="/bgimage.png" alt="Login Image" className="max-w-lg" />
      </div>

      {/* Right Section with Form */}
      <div className="w-full md:w-3/5 flex justify-center items-center bg-white relative rounded-tl-[65px] rounded-bl-[65px]">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center text-[#393269] mb-10">LOGIN</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#393269] text-white rounded-lg hover:bg-[#5A41C7] transition"
            >
              Sign In
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}

          <p className="text-center text-[#5A41C7] mt-3 cursor-pointer">
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
}
