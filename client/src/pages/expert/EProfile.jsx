import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '/SmartTool/client/src/firebase';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const ExpertProfile = () => {
  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    businessName: '',
    role: '',
    specialty: '',
    yearsOfExperience: '',
    address: '',
    registrationStatus: '',
    contactPersonName: '',
    contactPersonPhone: '',
  });
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [documentType, setDocumentType] = useState('license');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const auth = getAuth(app)
  const [currentUser, setCurrentUser] = useState({ profilePicture: '/default-profile.png' });

  // Initialize Firebase Storage
  const storage = getStorage(app);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/expert/me', {
          withCredentials: true,
        });
        setExpertData(res.data);
        
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          role: res.data.role || '',
          specialty: res.data.specialty || '',
          yearsOfExperience: res.data.yearsOfExperience || '',
          address: res.data.address || '',
          registrationStatus: res.data.registrationStatus || '',
          contactPersonName: res.data.contactPersonName || '',
          contactPersonPhone: res.data.contactPersonPhone || '',
        });
        
        if (res.data.profilePicture) {
          setImageFileUrl(res.data.profilePicture);
        }
      } catch (err) {
        console.error('Failed to load profile:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const filteredData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          filteredData[key] = value;
        } else if (value !== '') {
          filteredData[key] = value;
        }
      });
      
      await axios.put('http://localhost:3000/api/expert/me', filteredData, {
        withCredentials: true,
      });
  
      alert('Profile updated successfully!');
      
      const res = await axios.get('http://localhost:3000/api/expert/me', {
        withCredentials: true,
      });
      setExpertData(res.data);
    } catch (err) {
      console.error('Failed to update profile:', err.response?.data || err.message);
      alert('Profile update failed: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in to upload a profile picture');
      return;
    }
  
    const storage = getStorage(app);
    const storageRef = ref(storage, `profilePictures/${user.uid}/${Date.now()}_${file.name}`); // <-- user.uid එක add කලොත් නියමයි!
  
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading:', error);
        alert('Failed to upload profile picture');
        setUploadProgress(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageFileUrl(downloadURL);
  
        try {
          await axios.put('http://localhost:3000/api/expert/me', {
            profilePicture: downloadURL
          }, {
            withCredentials: true
          });
  
          alert('Profile picture uploaded successfully!');
        } catch (err) {
          console.error('Failed to update profile:', err);
          alert('Failed to update profile!');
        } finally {
          setUploadProgress(null);
        }
      }
    );
  };
  
  
  const handleDocumentFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleDocumentUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
  
    try {
      setUploadProgress(0);
      setErrorMessage('');
      setSuccessMessage('');
  
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please sign in to upload documents');
      }
  
      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `documents/${user.uid}/${timestamp}.${fileExtension}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      // Track upload progress
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => reject(error),
          () => resolve()
        );
      });
  
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
      // Send to backend
      const response = await axios.post(
        'http://localhost:3000/api/expert/upload-document',
        {
          documentType,
          documentUrl: downloadURL,
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        }
      );
  
      if (response.data.success) {
        setSuccessMessage('Document uploaded successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to save document');
      }
    } catch (error) {
      console.error('Document upload failed:', error);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        'Document upload failed. Please try again.'
      );
    } finally {
      setUploadProgress(null);
    }
  };
  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="text-xl font-semibold">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar role="expert" />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
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
            Expert Profile
          </h2>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Username:</strong> {expertData.username || 'Not set'}</div>
              <div><strong>Email:</strong> {expertData.email || 'Not set'}</div>
              <div><strong>Role:</strong> {expertData.role || 'Not set'}</div>
              <div><strong>Specialty:</strong> {expertData.specialty || 'Not set'}</div>
              <div><strong>Years of Experience:</strong> {expertData.yearsOfExperience || 'Not set'}</div>
              <div><strong>Address:</strong> {expertData.address || 'Not set'}</div>
              <div><strong>Registration Status:</strong> {expertData.registrationStatus || 'Not verified'}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Update Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your username"
                />
              </div>

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

              <div>
                <label className="block text-gray-600 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your role"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your specialty"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Years of Experience</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter years of experience"
                />
              </div>

              <div className="md:col-span-2">
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
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Contact person's name"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="contactPersonPhone"
                  value={formData.contactPersonPhone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Contact person's phone number"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Verification Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-gray-600 mb-1">Document Type</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={documentType}
                  onChange={handleDocumentTypeChange}
                >
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
                  ref={documentInputRef}
                  onChange={handleDocumentFileChange}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-end gap-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
            >
              Update Profile
            </button>
            <button 
              onClick={handleDocumentUpload}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
              disabled={!file}
            >
              {uploadProgress ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;