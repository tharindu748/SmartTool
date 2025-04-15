// src/pages/auth/Register.jsx

import { useState } from 'react';
import TextInput from '../../components/TextInput';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ role: 'customer' });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let documentUrl = null;

    if (file) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `registerDocs/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (err) => setError('File upload failed.'),
        async () => {
          documentUrl = await getDownloadURL(uploadTask.snapshot.ref);
          submitForm(documentUrl);
        }
      );
    } else {
      submitForm();
    }
  };


  const submitForm = async (documentUrl = null) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, documents: documentUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <div>
          <label className="text-sm">Your username</label>
          <TextInput id="username" placeholder="Enter your username" onChange={handleChange} required />
        </div>
        <div>
          <label className="text-sm">Your email</label>
          <TextInput id="email" type="email" placeholder="name@gmail.com" onChange={handleChange} required />
        </div>
        <div>
          <label className="text-sm">Your password</label>
          <TextInput id="password" type="password" placeholder="Enter your password" onChange={handleChange} required />
        </div>

        <label className="text-sm">Select Role</label>
        <select id="role" value={formData.role} onChange={handleChange} className="p-2 border rounded">
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
          <option value="expert">Expert</option>
        </select>

        {formData.role === 'supplier' && (
          <>
            <div>
              <label className="text-sm">Business Name</label>
              <TextInput id="businessName" placeholder="Enter your business name" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm">Address</label>
              <TextInput id="address" placeholder="Enter your address" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm">Tool Categories</label>
              <TextInput id="toolCategories" placeholder="Enter tool categories" onChange={handleChange} required />
            </div>
            <label className="text-sm">Upload Business License</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </>
        )}

        {formData.role === 'expert' && (
          <>
            <div>
              <label className="text-sm">Specialty</label>
              <TextInput id="specialty" placeholder="Enter your specialty" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm">Years of Experience</label>
              <TextInput id="experience" placeholder="Enter years of experience" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm">Rate Per Hour (LKR)</label>
              <TextInput id="ratePerHour" placeholder="Enter rate per hour" onChange={handleChange} required />
            </div>
            <label className="text-sm">Upload Certification</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </>
        )}

        {uploadProgress && <p className="text-sm">Uploading: {uploadProgress.toFixed(0)}%</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}