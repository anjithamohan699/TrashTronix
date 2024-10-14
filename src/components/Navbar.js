import { Bars3Icon, UserCircleIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Import UserPlusIcon
import { useState } from 'react';
import { auth } from '../lib/firebase'; // Firebase authentication instance
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase auth method
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing Eye and EyeSlash icons
import { signOut } from 'firebase/auth'; // Import signOut method
import { useRouter } from 'next/navigation'; // For App Router

export default function Navbar({ setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const router = useRouter(); // Initialize the router

  // State for the add user form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); // For role selection
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Handle form submission for adding a user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create a new user in Firebase with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add additional user information in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        name,
        username,
        email,
        role,
      });

      alert('User added successfully!');
      setFormOpen(false); // Close the form upon successful submission

      // Reset the form fields
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (err) {
      setError('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle for the Add User form, ensuring the logout dropdown is closed
  const toggleFormOpen = () => {
    if (dropdownOpen) {
      setDropdownOpen(false); // Close the logout dropdown if it's open
    }
    setFormOpen(!formOpen); // Toggle the Add User form
  };

  // Toggle for the Logout dropdown, ensuring the Add User form is closed
  const toggleDropdownOpen = () => {
    if (formOpen) {
      setFormOpen(false); // Close the Add User form if it's open
    }
    setDropdownOpen(!dropdownOpen); // Toggle the Logout dropdown
  };

  // Add a logout function
const handleLogout = async () => {
  try {
    await signOut(auth);
    alert('Logged out successfully!');
    router.push('/login'); // Navigate to login page
  } catch (error) {
    console.error('Error logging out: ', error);
  }
};

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
        {/* <button className="mx-3" onClick={toggleFormOpen}>
          <UserPlusIcon className="h-8 w-8 text-white" />
        </button>  */}

        {/* Account Icon */}
        <div className="relative">
        <button onClick={toggleDropdownOpen}>
            <UserCircleIcon className="h-8 w-8 text-white mt-2" />
          </button>

          {/* Dropdown for Account */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#8DD8CC] rounded-lg shadow-lg py-2">
              <button
      onClick={handleLogout}
      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
    >
      Logout
    </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Dropdown */}
      {/* {formOpen && (
        <div className="absolute right-12 top-20 mt-2 w-72 bg-gray-300 rounded-lg shadow-lg p-8 z-20">
          <div className="flex justify-between items-center">
            <h2 className="text-lg  mb-2 font-semibold text-black text-center">Add User</h2>
            <button onClick={() => setFormOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
          </div> */}

          {/* Error message */}
         {/* {error && <p className="text-red-600 text-center mb-2">{error}</p>} */}

         {/* <form className="space-y-3 mt-2" onSubmit={handleAddUser}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black"
            />
            <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black"
            /> */}
            {/* Eye icon to toggle password visibility */}
          {/*  <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </div>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-black"
            >
              <option value="" disabled>Select Role</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option> */}
              {/* Add more roles if needed */}
          {/*  </select>

            <button
              type="submit"
              className={`w-full bg-[#228B22] text-white py-2 rounded-md ${loading ? 'bg-gray-400' : ''}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Submit'}
            </button>
          </form>
        </div>
      )} */}
    </nav>
  );
}
