// src/app/admin/page.js
"use client";
import { Bars3Icon, UserCircleIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'; // Import signOut method
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const router = useRouter();

  const [complaints, setComplaints] = useState([]);
  const [activeComplaintsCount, setActiveComplaintsCount] = useState(0);

  const data = {
    activeComplaints: activeComplaintsCount,
    activeTrashtrons: 8,
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500 text-white";
      case "Active":
        return "bg-green-500 text-white";
      case "Completed":
        return "bg-blue-500 text-white";
      case "Accepted": // Add this line
      return "bg-green-500 text-white"; // Or any other color you prefer
      default:
        return "";
    }
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

// Fetch data from Firestore on component mount
useEffect(() => {
  const fetchAcceptedComplaints = async () => {
    try {
      const complaintsRef = collection(db, "complaints");
      const acceptedQuery = query(complaintsRef, where("status", "==", "Accepted"));
      const querySnapshot = await getDocs(acceptedQuery);
      const complaintsData = [];

      querySnapshot.forEach((doc) => {
        const { description, status, date } = doc.data();
        // Check if 'date' is a Firestore Timestamp and convert it to JS Date
        const formattedDate = date && date.toDate ? date.toDate() : new Date(date);
        complaintsData.push({
          id: doc.id,
          description,
          status,
          date: formattedDate  // store formatted date in complaint object
        });
      });

      console.log("Fetched accepted complaints:", complaintsData);
      setComplaints(complaintsData);
      setActiveComplaintsCount(complaintsData.length);
    } catch (error) {
      console.error("Error fetching accepted complaints:", error);
    }
  };

  fetchAcceptedComplaints();
}, []);

// Function to format date to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        enter="transition-transform duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-[#393269] text-white z-50 flex flex-col shadow-lg">
          <div className="flex justify-end p-4">
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              {/* <li>
                <button onClick={() => router.push('/admin')} className="text-white">
                  Dashboard
                </button>
              </li> */}
              <li>
                <button onClick={() => router.push('/admincomplaints')} className="text-white">
                  Complaints
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/works')} className="text-white">
                  Works
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/reports')} className="text-white">
                  Reports
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-[#393269] text-white p-4 flex justify-between items-center shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="focus:outline-none">
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
          <div className="text-xl font-bold">Trashtronix Admin</div>
          <div className="flex items-center">
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
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
        </nav>

        {/* Statistics Section */}
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center">
            {/* Active Complaints Card */}
            <div className="w-full max-w-xs mx-auto p-4 border rounded shadow bg-white">
              <div className="card-header font-bold text-black">Active Complaints</div>
              <div className="card-body">
                <h5 className="card-title text-2xl text-gray-700 mb-4">{data.activeComplaints}</h5>
                <button onClick={() => router.push('/admincomplaints')} className="btn text-white bg-blue-500 rounded p-2">
                  View Details
                </button>
              </div>
            </div>

            {/* Active Robo Trashtrons Card */}
            <div className="w-full max-w-xs mx-auto p-4 border rounded shadow bg-white">
              <div className="card-header font-bold text-black">Robo Trashtrons Active</div>
              <div className="card-body">
                <h5 className="card-title text-2xl text-gray-700 mb-4">{data.activeTrashtrons}</h5>
                <button className="btn text-white bg-blue-500 rounded p-2">Monitor Robots</button>
              </div>
            </div>
          </div>

          {/* Recent Activities Table */}
          <div className="mt-4 text-black">
            <h2 className="text-black text-lg font-bold mb-2">Recent Activities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 shadow-md">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border px-4 py-2">SI No</th>
                    <th className="border px-4 py-2">Activity</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint, index) => (
                    <tr key={complaint.id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{complaint.description}</td>
                      <td className="border px-4 py-2">
                        {/* Format the date here */}
                        {formatDate(complaint.date)}
                      </td>
                      <td className="border px-4 py-2">
                        <span className={`px-2 py-1 rounded-lg ${getBadgeClass(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
