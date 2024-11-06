'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase'; // Import your firebase configuration
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaHome } from 'react-icons/fa'; // Import home icon from react-icons

export default function ComplaintStatus() {
  const [user, setUser] = useState(null); // State to hold user data
  const [complaints, setComplaints] = useState([]); // State to hold complaints
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // State to hold error messages

  useEffect(() => {
    // Check for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchComplaints(currentUser.email); // Fetch complaints when user is logged in
      } else {
        setComplaints([]); // Clear complaints if user is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const fetchComplaints = async (email) => {
    try {
      const q = query(collection(db, 'complaints'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const complaintsList = [];
      querySnapshot.forEach((doc) => {
        complaintsList.push({ id: doc.id, ...doc.data() });
      });

      // Sort complaints: Rejected first, then Pending, then Accepted
      complaintsList.sort((a, b) => {
        const order = { Rejected: 1, Pending: 2, Accepted: 3 };
        return (order[a.status] || 4) - (order[b.status] || 4);
      });

      setComplaints(complaintsList);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError('Failed to fetch complaints. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-500 p-6">
      <div className="flex items-center mb-12">
        <FaHome 
          className="text-white cursor-pointer mr-6" // Increased margin for spacing
          size={24} 
          title="Home" // Tooltip text
          onClick={() => window.location.href = '/complaint'} // Navigate to complaint page
        />
        <h1 className="text-4xl font-bold text-white ">Your Complaint Status</h1>
      </div>

      {loading ? (
        <p className="text-white text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : complaints.length === 0 ? (
        <p className="text-white text-lg">No complaints found.</p>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-4`}>
          {complaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 transform transition-transform duration-500 ease-in-out mb-4 max-w-xs text-black hover:scale-110 hover:translate-y-[-10px] hover:shadow-2xl" // Added translate and increased duration for smoothness
            >
              <h2 className="text-lg font-bold mb-2 text-blue-700">Complaint Details</h2>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Location:</strong> {complaint.location}</p>
              <p>
                <strong>File URL:</strong>
                <a 
                  href={complaint.fileURL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              </p>
              <p className={`font-semibold ${
                complaint.status === 'Rejected' ? 'text-red-600' :
                complaint.status === 'Pending' ? 'text-yellow-600' :
                complaint.status === 'Accepted' ? 'text-green-600' :
                'text-yellow-600'  // Default color if status is undefined or unhandled
                }`}>
                <strong>Status:</strong> {complaint.status || "Pending"}
              </p>

              {complaint.status === 'Rejected' && complaint.rejectionReason && (
                <p className="text-red-600"><strong>Rejection Reason:</strong> {complaint.rejectionReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
