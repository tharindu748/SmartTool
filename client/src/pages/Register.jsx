// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Register = () => {
  const [role, setRole] = useState('supplier');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let documentURL = '';
    if (formData.document) {
      const fileRef = ref(storage, `documents/${formData.document.name}`);
      await uploadBytes(fileRef, formData.document);
      documentURL = await getDownloadURL(fileRef);
    }

    await axios.post('/api/auth/register', {
      ...formData,
      document: documentURL,
      role,
    });

    alert('Submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Register as {role}</h2>
      <select onChange={(e) => setRole(e.target.value)} className="border p-2 w-full">
        <option value="supplier">Supplier</option>
        <option value="expert">Expert</option>
      </select>
      <input name="name" placeholder="Full Name" className="border p-2 w-full" onChange={handleChange} />
      <input name="email" placeholder="Email" type="email" className="border p-2 w-full" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" className="border p-2 w-full" onChange={handleChange} />
      <input name="document" type="file" className="w-full" onChange={handleChange} />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
};

export default Register;
