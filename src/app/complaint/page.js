'use client';
import { useState, useEffect } from "react";
import { db, auth, googleProvider } from '../../lib/firebase'; // Import your firebase configuration
//import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { storage } from '../../lib/firebase'; // Import Firebase storage from your configuration
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import sign out functionality
import SignupModal from './SignupModal'; // Import the signup modal component
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function Registration() {
  const [location, setLocation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(""); // For displaying success/error messages
  const [loading, setLoading] = useState(false); // Loading state
  const [user, setUser] = useState(null); // State to hold user data
  const [typingWithoutLogin, setTypingWithoutLogin] = useState(false); // State to track typing without login
  const [showLoginMessage, setShowLoginMessage] = useState(false); // State for showing login message
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message visibility
  const [logoutSuccessMessage, setLogoutSuccessMessage] = useState(""); // State for logout success message
  const [complaintStatus, setComplaintStatus] = useState(null); // Store complaint status
   // Get the current date
   const date = new Date(); // Current date and time

  useEffect(() => {
    // Check for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setTypingWithoutLogin(false); // Reset typing state when logged in
        setShowLoginMessage(false); // Hide login message when logged in
        setEmail(currentUser.email); // Automatically set email
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleInputFocus = () => {
    // Set typingWithoutLogin to true if user is not logged in
    if (!user) {
      setTypingWithoutLogin(true);
      setShowLoginMessage(true); // Show login message when typing without login
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!user) {
      setMessage("Please log in to register your complaint.");
      return;
    }

    // Check if the location is empty
    if (!location) {
      setMessage("Please allow location access or provide a location.");
      return;
    }

    // Check if a file is selected
    if (!file) {
      setMessage("Please upload a file.");
      return;
    }

    // Set loading state to true
    setLoading(true);

    // Create a new document in Firestore
    try {
      let fileURL = null;

      // Upload file to Firebase Storage
      const fileRef = ref(storage, `complaints/${user.uid}/${file.name}`); // File path in Firebase Storage
      const snapshot = await uploadBytes(fileRef, file); // Upload file to Firebase Storage
      fileURL = await getDownloadURL(snapshot.ref); // Get the download URL after the upload
      console.log("File uploaded successfully. File URL: ", fileURL);

      const docRef = await addDoc(collection(db, "complaints"), {
        firstName,
        lastName,
        email,
        description,
        location,
        fileURL,
        date: date.toISOString(), // Store date as ISO string
      });
      console.log("Document written with ID: ", docRef.id);
      //setMessage("Registration successful!"); // Success message
      setShowSuccessMessage(true); // Show success notification

      // Reset the form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setDescription("");
      setLocation("");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('fileInput');
      if (fileInput && fileInput instanceof HTMLInputElement) {
          fileInput.value = ''; // Resetting the file input
      }
      
      // Automatically hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Registration failed. Please try again."); // Error message
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setLogoutSuccessMessage("You have logged out successfully."); // Set the logout success message

    // Automatically hide the logout success message after 3 seconds
    setTimeout(() => {
      setLogoutSuccessMessage("");
    }, 3000);
  };


  return (
    <div className="flex h-screen container mx-auto bg-gradient-to-r from-blue-900 to-blue-400 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Left Panel */}
        
        <div className="mb=6 text-center text-white md:col-span-1 relative">
          <img
            src="/Rocket-190970.png"
            alt="logo"
            className="mx-auto mt-40 animate-bounce w-1/5 brightness-0 invert mb=0 "
          />
          <h3 className="text-3xl font-semibold mb-4">Welcome User</h3>
          <p>You are 30 seconds away <br />from registering<br /> your complaint!</p>

          {/* Notification Message Above Login Button */}
          {showLoginMessage && (
            <div className="absolute left-80 bottom-50 flex items-center">
              <span className="mr-2">👈</span> {/* Left Pointing Hand Gesture */}
              <div className="relative">
                <p className="bg-red-500 text-white p-2 rounded-md pr-10">
                  You need to log in!
                  {/* Close Icon */}
                  <button
                    onClick={() => setShowLoginMessage(false)} // Close the message
                    className="absolute top-0 right-2 mt-1 mr-1 text-white"
                  >
                    X
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Conditionally Render Login or Logout */}
          {!user ? (
            <button 
              className="mt-10 bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-full"
              onClick={() => setIsModalOpen(true)} // Open the modal
            >
              Login
            </button>
          ) : (
            <>
            <button 
              className="mt-10 bg-red-500 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleLogout} // Call logout function
            >
              Logout
            </button>

             {/* Status Button */}
        <button onClick={() => window.location.href = '/complaintStatus'} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
        Status
      </button>

      {/* {complaintStatus && (
        <p className="mt-2 bg-white text-black p-2 rounded-lg">{complaintStatus}</p>
      )} */}
      </>
          )}
        </div>

        {/* Right Panel */}
        <div className="col-span-2 bg-gray-100 rounded-lg shadow-lg p-4 w-11/12 h-auto mx-auto mt-10 mb-10 relative rounded-tl-[80px] rounded-bl-[80px]">
          <h3 className="text-center text-2xl font-semibold mb-6 mt-16 text-black">Register Complaint  !</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={handleInputFocus} // Track focus on input
                className="w-11/12 p-2 border rounded-lg mb-4 ml-4 text-black"
                placeholder="First Name *"
                required
                disabled={showLoginMessage} // Disable field if user isn't logged in
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={handleInputFocus} // Track focus on input
                className="w-11/12 p-2 border rounded-lg mb-4 ml-4 text-black"
                placeholder="Last Name *"
                required
                disabled={showLoginMessage} // Disable field if user isn't logged in
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleInputFocus} // Track focus on input
                className="w-11/12 p-2 border rounded-lg mb-4 ml-4 text-black"
                placeholder="Your Email *"
                required
                disabled={showLoginMessage} // Disable field if user isn't logged in
              />
              <textarea
                className="w-11/12 ml-4 p-2 border rounded-lg mb-4 resize-none text-black"
                placeholder="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={handleInputFocus} // Track focus on input
                disabled={showLoginMessage} // Disable field if user isn't logged in
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="w-11/12 bg-blue-600 text-white p-2 rounded-lg mb-6"
                  disabled={showLoginMessage} // Disable button if user isn't logged in
                >
                  Get Location
                </button>
                <input
                  type="text"
                  value={location}
                  readOnly
                  className="w-11/12 p-2 border rounded-lg  cursor-pointer text-gray-700 bg-white"
                  placeholder="Location will appear here"
                  required
                  disabled={showLoginMessage} // Disable field if user isn't logged in
                />
                {!location && <p className="text-red-500 mt-0">* Location is required</p>}
                <input
                  type="file"
                  id="fileInput"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-11/12 p-2 border rounded-lg mt-6 cursor-pointer text-gray-700 bg-white"
                  required // Make file input required
                  disabled={showLoginMessage} // Disable field if user isn't logged in
                />
                {!file && <p className="text-red-500">* File is required</p>} {/* Error message for file */}
              </div>
              <button
                type="submit"
                className="w-11/12 bg-green-600 text-white p-2 rounded-lg mt-0 mb-6"
                disabled={loading || showLoginMessage} // Disable submission if loading or not logged in
              >
                {loading ? "Registering..." : "Register Complaint"}
              </button>
              {message && <p className="text-red-500 text-center mt-4">{message}</p>}
            </div>
          </form>

          {/* Success Notification */}
          {showSuccessMessage && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
              Registration successful! 🎉
            </div>
          )}

          {/* Success Notification for Logout */}
          {logoutSuccessMessage && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
              {logoutSuccessMessage} 🎉
            </div>
          )}
        </div>
      </div>

      {/* Modal for Google Sign In */}
      {isModalOpen && (
        <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
