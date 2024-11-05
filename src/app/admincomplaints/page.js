"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaCheckCircle, FaTimesCircle, FaClock, FaHome, FaSignOutAlt, FaFileAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'; // Import signOut method
import { auth } from '@/lib/firebase';

export default function AdminComplaints() {

  const router = useRouter(); // Initialize router here

  const [complaints, setComplaints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // Store the selected complaint
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionBox, setShowRejectionBox] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const complaintsData = [];
      querySnapshot.forEach((doc) => {
        complaintsData.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsData);
    };

    fetchComplaints();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= complaints.length ? 0 : prevIndex + 3
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? complaints.length - (complaints.length % 3 || 3) : prevIndex - 3
    );
  };

  const openSidebar = (complaint) => {
    setSelectedComplaint(complaint); // Set the clicked complaint as selected
    setIsSidebarOpen(true);
    setShowRejectionBox(false);
    setRejectionReason("");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setShowRejectionBox(false);
  };

  const handleAccept = async (id) => {
    await updateDoc(doc(db, "complaints", id), {
      status: "Accepted",
    });
    closeSidebar();
    alert("Complaint accepted successfully.");
  };

  const handleRejectClick = () => {
    setShowRejectionBox(true);
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "complaints", id), {
      status: "Rejected",
      rejectionReason: rejectionReason,
    });
    closeSidebar();
    alert("Complaint rejected with reason.");
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted") {
      return (
        <FaCheckCircle className="text-green-500" title="Accepted" size={24} />
      );
    } else if (status === "Rejected") {
      return (
        <FaTimesCircle className="text-red-500" title="Rejected" size={24} />
      );
    } else {
      return <FaClock className="text-yellow-500" title="Pending" size={24} />;
    }
  };

  const totalPages = Math.ceil(complaints.length / 3);

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
    {/* Sidebar */}
    <div
      className="fixed left-0 top-0 h-full bg-gray-900 text-white flex flex-col items-center py-6"
      style={{ width: "60px" }}
    >
    <FaHome size={24} className="mb-8 cursor-pointer" title="Home" onClick={() => window.location.href = '/admin'}/>
    <FaFileAlt size={24} className="mb-8 cursor-pointer" title="Reports" />
    <FaSignOutAlt size={24} className="cursor-pointer" title="Logout" onClick={handleLogout}/>
    </div>
      {/* Complaint Card Slider */}
      <div className="relative w-full max-w-5xl overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex / 3) * 100}%)`,
            willChange: "transform",
          }}
        >
          {complaints.map((complaint, index) => (
            <div
              key={complaint.id}
              className="flex-shrink-0 w-80 h-60 p-4 rounded-xl shadow-lg transition-transform duration-500 transform mx-2 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6366f1, #f43f5e)",
              }}
              onClick={() => openSidebar(complaint)}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">
                  {complaint.firstName} {complaint.lastName}
                </h2>
                {/* Status Icon */}
                <span>{getStatusIcon(complaint.status)}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openSidebar(complaint); // Pass the complaint to openSidebar
                }}
                className="mt-8 bg-white text-purple-600 px-4 py-1 rounded-full shadow-md hover:bg-purple-100 transition-all"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === Math.floor(currentIndex / 3)
                ? "bg-indigo-500"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 transition-all duration-300"
      >
        &#10094;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 transition-all duration-300"
      >
        &#10095;
      </button>

      {/* Sidebar for Viewing Details */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 50 }}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-black font-bold">Complaint Details</h2>
          <button onClick={closeSidebar} className="text-red-500 text-xl">
            &times;
          </button>
        </div>
        {selectedComplaint && (
          <div className="p-4 text-black">
            <h3 className="text-2xl font-bold mb-2">
              {selectedComplaint.firstName} {selectedComplaint.lastName}
            </h3>
            <p className="mb-2">
              <strong>Email:</strong> {selectedComplaint.email}
            </p>
            <p className="mb-2">
              <strong>Description:</strong> {selectedComplaint.description}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {selectedComplaint.location}
            </p>
            {selectedComplaint.fileURL && (
              <a
                href={selectedComplaint.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-blue-500 underline"
              >
                Open Image
              </a>
            )}

            {/* Conditionally Rendered Rejection Reason Box */}
            {showRejectionBox && (
              <textarea
                className="w-full mt-4 p-2 border rounded"
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
            )}

            {/* Complaint Accept and Reject Buttons */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleAccept(selectedComplaint.id)}
                className="flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 hover:scale-105 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
              >
                <FaCheckCircle className="mr-2" />
                Accept
              </button>
              <button
                onClick={handleRejectClick}
                className="flex items-center justify-center bg-gradient-to-r from-red-400 to-red-600 hover:scale-105 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
              >
                <FaTimesCircle className="mr-2" />
                Reject
              </button>
            </div>

            {/* Finalize Rejection Button */}
            {showRejectionBox && (
              <button
                onClick={() => handleReject(selectedComplaint.id)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
              >
                Submit Rejection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
