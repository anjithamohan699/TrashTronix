// login/page.js

'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc'; // Importing Google icon from react-icons
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing Eye and EyeSlash icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log('Logged in user:', user.uid);
  
      // Fetch role from Firestore (assuming role is stored under a collection called 'admin')
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log('User role:', role);
  
        // Redirect based on role
        if (role === 'admin') {
          router.push('/admin');
        } 
        // else if (role === 'staff') {
        //   router.push('/staff');
        // } 
        else {
          router.push('/user');
        }
      } else {
        console.error('No such document!');
        setError('User role not found');
      }
    } catch (error) {
      console.error('Login Error:', error.code, error.message);
      setError(error.message);  // Display the actual error message
    }    
  };  

  // Navigate to reset password page
  const handleForgotPassword = () => {
    router.push('/reset-password');
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Google Sign-In Successful', user);

      // Fetch role from Firestore (assuming role is stored under a collection called 'admin')
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log('User role:', role);
  
        // Redirect based on role
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'staff') {
          router.push('/staff');
        } else {
          router.push('/complaint');
        }
      } else {
        console.error('No such document!');
        setError('User role not found');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);  // This will log the detailed error
      setError('Google Sign-In Failed');
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

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center mt-4 px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-[#393269] hover:text-white transition"
          >
            <FcGoogle/> &nbsp; Sign In with Google
          </button>

          <div className="text-center mt-4 mb-4 text-gray-400">- OR -</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Eye icon to toggle password visibility */}
            <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#393269] text-white rounded-lg hover:bg-[#5A41C7] transition"
            >
              SIGN IN
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}

          <p className="text-center text-[#5A41C7] mt-3 cursor-pointer"
          onClick={handleForgotPassword}>
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
}
