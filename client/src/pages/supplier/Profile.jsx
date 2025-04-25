import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const SupplierProfile = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    businessName: '',
    email: '',
    address: '',
    businessType: '',
    businessDescription: '',
    registrationStatus: '',
  });
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState({ profilePicture: '/default-profile.png' }); // default user

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/supplier/me', {
          withCredentials: true,
        });
        setSupplierData(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err.response?.data || err.message);
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      // 1. Filter formData: remove empty fields
      const filteredData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim() !== '') { // if value not empty
          filteredData[key] = value;
        }
      });
  
      // 2. Axios call with filtered data
      await axios.put('http://localhost:3000/api/supplier/me', filteredData, {
        withCredentials: true,
      });
  
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err.response?.data || err.message);
      alert('Profile update failed.');
    }
  };
  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFileUrl(reader.result);
        setUploadProgress(100); // fake complete upload
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!supplierData) return <div>No profile data found.</div>;

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar role="supplier" />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-blue-500 cursor-pointer relative"
            >
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                  {uploadProgress}%
                </div>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
            Supplier Profile
          </h2>

          {/* Business Info Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Username:</strong> {supplierData.username || 'Supun'}</div>
              <div><strong>Email:</strong> {supplierData.email || 'supun@email.com'}</div>
              <div><strong>Business Name:</strong> {supplierData.businessName || 'Supun Enterprises'}</div>
              <div><strong>Business Type:</strong> {supplierData.businessType || 'Manufacturer'}</div>
              <div><strong>Business Description:</strong> {supplierData.businessDescription || 'Tool Manufacturer & Supplier'}</div>
              <div><strong>Address:</strong> {supplierData.address || '123 Tool Street, Colombo'}</div>
              <div><strong>Registration Status:</strong> {supplierData.registrationStatus || 'Verified'}</div>
            </div>
          </div>

{/* Business Information Form */}
<div className="mb-6">
  <h3 className="text-xl font-semibold text-gray-700 mb-4">Business Information</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* Username */}
    <div>
      <label className="block text-gray-600 mb-1">User Name</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Enter your user name"
      />
    </div>

    {/* Email Address */}
    <div>
      <label className="block text-gray-600 mb-1">Email Address</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Enter your email address"
      />
    </div>

    {/* Address */}
    <div className="md:col-span-1">
      <label className="block text-gray-600 mb-1">Address</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Enter your business address"
      />
    </div>

    {/* Business Name */}
    <div className="md:col-span-1 ">
      <label className="block text-gray-600 mb-1">Business Name</label>
      <input
        type="text"
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Enter your business name"
      />
    </div>

  </div>
</div>

  

          {/* Contact Person */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Contact person's name"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Contact person's phone number"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Verification Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-gray-600 mb-1">Document Type</label>
                <select className="w-full p-2 border rounded">
                  <option value="license">Business License</option>
                  <option value="certificate">Certificate</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Upload Document</label>
                <input
                  type="file"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row md:justify-end gap-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
            >
              Update Profile
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded">
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;
