import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageFileUploadError('File size must be less than 2MB');
        return;
      }
      if (!file.type.match('image.*')) {
        setImageFileUploadError('Only image files are allowed');
        return;
      }
      setImageFileUploading(true);
      setImageFileUploadError(null);
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    setUploadProgress(0);
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        () => {
          setImageFileUploadError('Image upload failed');
          setUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
            setUploadProgress(100);
            setImageFileUploading(false);
          });
        }
      );
    } catch {
      setImageFileUploadError('Image upload failed');
      setUploadProgress(null);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    if (formData.password === "*********") {
      delete formData.password;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess({ data }));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="max-w-10xl mx-auto px-4 py-6 ">
      <h1 className="text-3xl mx-auto font-semibold mb-8">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="flex justify-center mb-6">
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
            <div onClick={() => fileInputRef.current.click()} className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-blue-500 cursor-pointer relative">
              <img src={imageFileUrl || currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                  {uploadProgress}%
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div><label className='User Name'>New Name</label>
            <TextInput id="username" type="text" label="Username" defaultValue={currentUser.username} onChange={handleChange} /></div>
            <div><label className='User Name'>New Email</label>
            <TextInput id="email" type="email" label="Email" defaultValue={currentUser.email} onChange={handleChange} /></div>
            <div><label className='User Name'>User Address</label>
            <TextInput id="Address" type="text" label="Address" placeholder="Your address" defaultValue={currentUser.Address} onChange={handleChange} /></div>
            <div><label className='User Name'>New Password</label>
            <TextInput id="password" type="password" label="Password" placeholder="••••••••" defaultValue="" onChange={handleChange} /></div>

            <button
              type="submit"
              disabled={uploadProgress !== null && uploadProgress < 100}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Update Profile
            </button>
          </form>

          {updateUserSuccess && <p className="text-green-500 mt-4 text-center">{updateUserSuccess}</p>}
          {updateUserError && <p className="text-red-500 mt-4 text-center">{updateUserError}</p>}
        </div>

        {/* Preview Section */}
        <div className="mx-20 mt-44 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Preview</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 font-medium">Username</p>
              <p className="text-gray-800">{formData.username || currentUser.username || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Email</p>
              <p className="text-gray-800">{formData.email || currentUser.email}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Address</p>
              <p className="text-gray-800">{formData.Address || currentUser.Address || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Password</p>
              <p className="text-gray-800">{formData.password ? "••••••••" : "Unchanged"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}