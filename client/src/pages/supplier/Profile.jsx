import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

export default function SupplierProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [supplierData, setSupplierData] = useState(null);
  
    useEffect(() => {
      const fetchSupplierDetails = async () => {
        try {
          const res = await fetch(`/api/supplier/${currentUser._id}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setSupplierData(data);
          }
        } catch (err) {
          console.error('Error fetching supplier data', err);
        }
      };
      if (currentUser?.role === 'supplier') {
        fetchSupplierDetails();
      }
    }, [currentUser]);
  
    return (
      <div className="flex min-h-screen">
        {/* Sidebar - Always visible */}
        <div className="w-64 border-r bg-gray-50">
          <Sidebar role={currentUser?.role} />
        </div>
      
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {!supplierData ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading supplier profile...</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Your existing profile content */}
              <div className="border p-4 rounded bg-white shadow">
                <h2 className="font-semibold mb-2">Personal Profile</h2>
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-gray-300 rounded-full" />
                  <div>
                    <p>{supplierData.username}</p>
                    <p>{supplierData.email}</p>
                    <p>{supplierData.address}</p>
                    <p>{supplierData.phone || '071XXXXXXX'}</p>
                  </div>
                </div>
                <button className="mt-4 bg-blue-600 text-white px-4 py-1 rounded">
                  EDIT
                </button>
              </div>
  
              {/* Rest of your content... */}
            </div>
          )}
        </div>
      </div>
    );
  }