// src/pages/expert/Profile.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

export default function ExpertProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [expertData, setExpertData] = useState(null);

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        console.log("🔁 Fetching profile for ID:", currentUser._id);
        const res = await fetch(`/api/expert/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await res.json();
        console.log("📥 Fetched profile data:", data);
        if (res.ok) {
          setExpertData(data);
        } else {
          console.error("❌ Backend error:", data.message);
        }
      } catch (error) {
        console.error("🚨 Fetch failed:", error.message);
      }
    };
  
    if (currentUser?.role === 'expert') fetchExpertData();
  }, [currentUser]);
  
  if (!expertData) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar role="expert" />
      <div className="flex-1 p-6 space-y-6">
        <div className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Expert Profile</h2>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-300" />
            <div className="space-y-1">
              <p><strong>Username:</strong> {expertData.username}</p>
              <p><strong>Email:</strong> {expertData.email}</p>
              <p><strong>Specialty:</strong> {expertData.specialty}</p>
              <p><strong>Experience:</strong> {expertData.experience} years</p>
              <p><strong>Rate Per Hour:</strong> Rs. {expertData.ratePerHour}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Uploaded Certifications</h3>
          {expertData.documents ? (
            <a href={expertData.documents} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              View Certificate
            </a>
          ) : (
            <p>No certification uploaded.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Update Rate</h3>
          <button className="bg-blue-600 text-white px-4 py-1 rounded">Edit Rate</button>
        </div>
      </div>
    </div>
  );
}
