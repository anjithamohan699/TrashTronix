'use client'; // This line makes the component a Client Component

import { useState } from 'react';
import { db } from '../../lib/firebase'; // Adjust the path according to your project structure
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function RegisterComplaint() {
  const [complaint, setComplaint] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Add complaint to Firestore (assuming you have a 'complaints' collection)
      await addDoc(collection(db, 'complaints'), {
        complaint: complaint,
        createdAt: new Date(),
      });
      
      setSuccess('Complaint registered successfully!');
      setComplaint(''); // Clear the input after successful submission
    } catch (err) {
      console.error(err);
      setError('Failed to register complaint. Please try again later.');
    }
  };

  return (
    <div className="flex h-screen bg-[#393269] justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#393269] mb-6">Register Complaint</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="4"
            className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Type your complaint here..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#393269] text-white rounded-lg hover:bg-[#5A41C7] transition"
          >
            Submit Complaint
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        {success && <p className="text-green-500 text-center mt-3">{success}</p>}
        
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/')} // Navigate back to home
            className="text-[#5A41C7] hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
