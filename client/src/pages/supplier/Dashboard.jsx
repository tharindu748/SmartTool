import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function SupplierDashboard() {
  const [identityVerified, setIdentityVerified] = useState(false);
  const [qualificationVerified, setQualificationVerified] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar injected */}
      <Sidebar role="supplier" />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>

        {/* Profile Section */}
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h3 className="font-medium mb-2">Personal profile</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div>
              <p>K. tharindu lakmal</p>
              <p>tlkama800@gmail.com</p>
              <p>No.308 Koulara south, Samanagala</p>
              <p>0715791748</p>
            </div>
          </div>
          <button className="mt-4 bg-blue-600 text-white py-1 px-4 rounded">EDIT</button>
        </div>

        {/* Top Boxes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow-sm p-4 rounded-lg">MY PRODUCT</div>
          <div className="bg-white shadow-sm p-4 rounded-lg">TOTAL ORDER</div>
        </div>

        {/* Documents & Notifications */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow-sm rounded-lg space-y-3">
            <h4 className="font-medium">Document</h4>
            <div className="flex items-center justify-between">
              <span>Identity verification</span>
              <input type="checkbox" checked={identityVerified} onChange={() => setIdentityVerified(!identityVerified)} />
              <button className="text-blue-600">View</button>
            </div>
            <div className="flex items-center justify-between">
              <span>Qualification verification</span>
              <input type="checkbox" checked={qualificationVerified} onChange={() => setQualificationVerified(!qualificationVerified)} />
              <button className="text-blue-600">View</button>
            </div>
            <button className="bg-gray-200 px-3 py-1 rounded">Upload</button>
          </div>

          <div className="space-y-3">
            <div className="bg-white shadow-sm p-3 rounded">Complain/news and notification</div>
            <div className="bg-white shadow-sm p-3 rounded">Confirm order</div>
          </div>
        </div>

        {/* Order Notification */}
        <div className="bg-white p-4 shadow-sm rounded-lg">
          <h4 className="font-medium mb-2">Order notification</h4>
          <div className="space-y-2">
            <div className="bg-gray-100 p-2 rounded">Order #1</div>
            <div className="bg-gray-100 p-2 rounded">Order #2</div>
            <div className="bg-gray-100 p-2 rounded">Order #3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
