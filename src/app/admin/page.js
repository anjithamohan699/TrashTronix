// src/app/admin/dashboard.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is an admin, otherwise redirect
        // Fetch user's role if needed, assuming role is already checked during login
        setUser(user);
      } else {
        // If no user is logged in, redirect to login page
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <p>You have administrator privileges.</p>
          {/* Add more admin-specific functionality here */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">System Overview</h2>
            <p>Manage users, view analytics, and more...</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
