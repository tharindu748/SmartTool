import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import TextInput from './TextInput';
import {
  updateStart,
  updateSuccess,
  updateFailure
} from '../redux/user/userSlice';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture || '');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(null);
  const [updateErrorMsg, setUpdateErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  // Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }

    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));
    setUploadError(null);
  };

  // Upload image to Firebase
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const uploadImage = () => {
    setImageUploading(true);
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${imageFile.name}`;
    const storageRef = ref(storage, `profilePics/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        setUploadError('Image upload failed.');
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
          setImageUploading(false);
        });
      }
    );
  };

  // Form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateErrorMsg(null);
    setUpdateSuccessMsg(null);

    if (imageUploading) {
      return setUpdateErrorMsg('Wait until image upload completes.');
    }

    if (Object.keys(formData).length === 0) {
      return setUpdateErrorMsg('No changes made.');
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateErrorMsg(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateSuccessMsg('Profile updated successfully.');
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
      setUpdateErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-8">Manage Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Form Section */}
        <div>
          <div className="flex justify-center mb-6">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 hover:border-blue-500 cursor-pointer relative"
            >
              <img
                src={imageFileUrl || '/default-avatar.png'}
                alt="avatar"
                className="w-full h-full object-cover"
              />
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                  {uploadProgress}%
                </div>
              )}
            </div>
          </div>

          {uploadError && <p className="text-red-500 text-center">{uploadError}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              id="username"
              label="Username"
              type="text"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
            <TextInput
              id="email"
              label="Email"
              type="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
            <TextInput
              id="address"
              label="Address"
              type="text"
              placeholder="Your address"
              defaultValue={currentUser.address}
              onChange={handleChange}
            />
            <TextInput
              id="password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={imageUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Update Profile
            </button>
          </form>

          {/* Feedback Messages */}
          {updateSuccessMsg && (
            <p className="text-green-600 text-center mt-4">{updateSuccessMsg}</p>
          )}
          {updateErrorMsg && (
            <p className="text-red-600 text-center mt-4">{updateErrorMsg}</p>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Preview</h2>

          <div className="space-y-4 text-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p>{formData.username || currentUser.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{formData.email || currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p>{formData.address || currentUser.address || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Password</p>
              <p>{formData.password ? '••••••••' : 'Unchanged'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
