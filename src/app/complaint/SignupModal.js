// SignupModal.js
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from '../../lib/firebase'; // Import your Firebase configuration
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SignupModal({ isOpen, onClose }) {
  // Function to handle Google Sign-In and Sign-Up
  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Log user info to debug
      console.log("User Info: ", user);

      // References to the user document in Firestore
      const userRef = doc(db, "users", user.uid);

      // Check if the user already exists in Firestore
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // User doesn't exist, create a new user document
        await setDoc(userRef, {
          name: user.displayName,
          username: user.email.split('@')[0], // Use email prefix as username
          email: user.email,
          role: 'user', // Default role for Google users
        });
        console.log("New user created and data saved to Firestore: ", user);
      } else {
        console.log("User already exists in Firestore.");
      }

      onClose(); // Close the modal after successful sign-in
    } catch (error) {
      console.error("Error signing in: ", error);
      // Check if Firestore permission error is here
      if (error.code === "permission-denied") {
        alert("Firestore permission denied. Please check your Firestore rules.");
      } else {
        alert("Sign-in failed. Please try again.");
      }
    }
  };

  // Modal Rendering Logic
  if (!isOpen) {
    return null; // Don't render the modal if it's not open
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">Sign In or Create an Account</h2>
        <p className="mb-4 text-black">Sign in with Google to create or access your account.</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-600 text-white p-2 rounded-lg mb-4"
        >
          Sign in with Google
        </button>
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white p-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
