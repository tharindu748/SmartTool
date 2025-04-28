import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '/SmartTool/client/src/firebase.js';
import { FiEdit, FiUpload, FiCheck, FiX, FiLock, FiMail, FiHome, FiUser } from 'react-icons/fi';
import { updateStart, updateSuccess, updateFailure } from '/SmartTool/client/src/redux/user/userSlice.js';
import Sidebar from '/SmartTool/client/src/components/Sidebar.jsx';
import axios from 'axios';
import ProgressBar from '/SmartTool/client/src/components/ProgressBar.jsx';
import Modal from '/SmartTool/client/src/components/Modal.jsx';
import PasswordStrengthMeter from '/SmartTool/client/src/components/PasswordStrengthMeter.jsx';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(null);
  const [updateErrorMsg, setUpdateErrorMsg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const fileInputRef = useRef(null);

  // Handle Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be smaller than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    try {
      const storage = getStorage(app);
      const fileName = `${currentUser._id}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `profilePics/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            setUploadError('Image upload failed');
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              reject(error);
            }
          }
        );
      });

      // Update profile in backend
      const res = await axios.put(`/api/user/update/${currentUser._id}`, {
        profilePicture: downloadURL,
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      // Update UI state
      dispatch(updateSuccess(res.data));
      setFormData(prev => ({ ...prev, profilePicture: downloadURL }));
      setUpdateSuccessMsg('Profile picture updated successfully!');
      
    } catch (error) {
      console.error('Profile update error:', error);
      setUploadError(error.message || 'Failed to update profile');
    } finally {
      setUploadProgress(null);
    }
  };

  // Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  // Submit Profile Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccessMsg(null);
    setUpdateErrorMsg(null);

    try {
      dispatch(updateStart());

      // Filter out empty fields
      const updatedFields = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      );

      const res = await axios.put(`/api/user/update/${currentUser._id}`, updatedFields, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      dispatch(updateSuccess(res.data));
      setUpdateSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      dispatch(updateFailure(err.response?.data?.message || err.message));
      setUpdateErrorMsg(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setUpdateErrorMsg('Passwords do not match');
      return;
    }
  
    try {
      dispatch(updateStart());
      
      const res = await axios.put(
        `/api/user/update-password/${currentUser._id}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { 
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Handle success
      dispatch(updateSuccess(res.data.user));
      setUpdateSuccessMsg(res.data.message || 'Password updated successfully!');
      
      // Reset form
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
  
    } catch (err) {
      // Handle error
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to update password';
      
      dispatch(updateFailure(errorMessage));
      setUpdateErrorMsg(errorMessage);
      
      console.error('Password update failed:', {
        error: err.response?.data || err,
        request: {
          url: `/api/user/update-password/${currentUser._id}`,
          data: {
            currentPassword: '***', // masked for security
            newPassword: '***'
          }
        }
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar role="buyer" />

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Profile Settings</h1>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2"
                >
                  <FiX /> Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <FiCheck /> Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <FiEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Status Messages */}
          {updateSuccessMsg && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {updateSuccessMsg}
            </div>
          )}
          {updateErrorMsg && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {updateErrorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-blue-400 cursor-pointer relative transition-all duration-200"
                  >
                    <img
                      src={formData.profilePicture || '/default-avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {uploadProgress !== null && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <ProgressBar progress={uploadProgress} />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <FiUpload size={16} />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800">{currentUser.username}</h2>
                <p className="text-gray-500">{currentUser.email}</p>
                
                {uploadError && (
                  <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                )}
                
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-2 text-sm"
                >
                  <FiLock /> Change Password
                </button>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    {isEditing ? (
                      <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{formData.username}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{formData.email}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    {isEditing ? (
                      <textarea
                        id="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full address"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md min-h-[3rem]">
                        {formData.address || 'No address provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Additional Sections can be added here */}
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Security</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiLock className="text-gray-600" />
                      <span className="font-medium">Password</span>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiMail className="text-gray-600" />
                      <span className="font-medium">Email Verification</span>
                    </div>
                    <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
  <div className="p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
    
    {updateErrorMsg && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {updateErrorMsg}
      </div>
    )}
    
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className="w-full px-3 py-2 border rounded-md"
          required
          minLength={6}
        />
        <PasswordStrengthMeter password={passwordData.newPassword} />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          className="w-full px-3 py-2 border rounded-md"
          required
          minLength={6}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => setShowPasswordModal(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          disabled={passwordData.newPassword !== passwordData.confirmPassword}
        >
          Update Password
        </button>
      </div>
    </form>
  </div>
</Modal>
    </div>
  );
}