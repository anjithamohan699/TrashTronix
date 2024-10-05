// src/app/staff/dashboard.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is a staff member, otherwise redirect
        setUser(user);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Staff Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <p>You have staff privileges.</p>
          {/* Add more staff-specific functionality here */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">Tasks & Assignments</h2>
            <p>View assigned tasks, manage daily operations, and more...</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
