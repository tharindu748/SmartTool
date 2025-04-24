import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';

const SupplierProfile = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [supplierData, setSupplierData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    password: '',
    profilePicture: ''
  });
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchSupplierData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/supplier/profile/${currentUser._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        
        // Handle potential null/undefined values
        const safeData = {
          ...data,
          businessName: data.businessName || 'Not provided',
          businessType: data.businessType || 'Not specified',
          businessDescription: data.businessDescription || 'No description',
          taxIdentificationNumber: data.taxIdentificationNumber || 'Not provided',
          businessLicense: data.businessLicense || { 
            url: null, 
            verified: false,
            uploadedAt: null
          },
          documents: data.documents || []
        };

        setSupplierData(safeData);
        setFormData({
          username: safeData.username || '',
          email: safeData.email || '',
          address: safeData.address || '',
          password: '',
          profilePicture: safeData.profilePicture || ''
        });
        setDocuments(safeData.documents);
        
      } catch (error) {
        console.error("Fetch error:", error);
        setUpdateError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSupplierData();
  }, [currentUser, navigate]);

  // ... (keep existing handleChange, handleImageUpload, handleDocumentUpload, handleSubmit functions)

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!supplierData) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-red-500">Failed to load supplier data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Supplier Profile</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Profile Picture and Basic Info */}
            <div className="w-full md:w-1/3 space-y-6">
              <div className="flex flex-col items-center">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                
                <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Upload Profile Picture
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* Business Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Business Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Name</p>
                    <p className="text-gray-800">{supplierData.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Type</p>
                    <p className="text-gray-800">{supplierData.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax ID</p>
                    <p className="text-gray-800">{supplierData.taxIdentificationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business License</p>
                    {supplierData.businessLicense.url ? (
                      <a 
                        href={supplierData.businessLicense.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View License
                      </a>
                    ) : (
                      <p className="text-red-500 text-sm">Not uploaded</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {supplierData.businessLicense.verified ? 
                        <span className="text-green-600">Verified</span> : 
                        <span className="text-yellow-600">Pending verification</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Editable Form and Documents */}
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Username</label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter new password"
                        minLength="8"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">Business Description</h2>
                  <textarea
                    className="w-full p-2 border rounded min-h-[100px]"
                    value={supplierData.businessDescription}
                    readOnly
                  />
                </div>

                {/* Documents Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">Business Documents</h2>
                  <div className="space-y-4">
                    <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 inline-block">
                      Upload New Document
                      <input 
                        type="file" 
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {documents.length > 0 ? (
                      <div className="border rounded divide-y">
                        {documents.map((doc, index) => (
                          <div key={index} className="p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className={doc.isVerified ? 'text-green-600' : 'text-yellow-600'}>
                                  {doc.isVerified ? 'Verified' : 'Pending Verification'}
                                </span>
                              </div>
                            </div>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Document
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Status Messages */}
          {updateSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {updateSuccess}
            </div>
          )}
          {updateError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {updateError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;