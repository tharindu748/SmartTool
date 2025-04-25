import { useState } from 'react';
import TextInput from '../../components/TextInput';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const [formData, setFormData] = useState({ role: 'supplier' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      let endpoint = '';
      if (formData.role === 'supplier') {
        endpoint = '/api/supplierregister';
      } else if (formData.role === 'expert') {
        endpoint = '/api/expertRegister';
      } else {
        throw new Error('Invalid role selected');
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
          <label className="text-sm">Your address</label>
          <TextInput 
            id="address"  
            placeholder="Address" 
            type="text"  
            className="border p-2 w-full rounded"
            onChange={handleChange}
            required
            value={formData.address || ''}
          />
        </div>

        <div>
          <label className="text-sm">Your password</label>
          <TextInput id="password" type="password" placeholder="Enter your password" onChange={handleChange} required />
        </div>

        <label className="text-sm">Select Role</label>
        <select id="role" value={formData.role} onChange={handleChange} className="p-2 border rounded">
          <option value="supplier">Supplier</option>
          <option value="expert">Expert</option>
        </select>

        {/* Supplier fields */}
        {formData.role === 'supplier' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <TextInput 
                  id="businessName" 
                  required 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Type</label>
                <select
                  id="businessType"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="distributor">Distributor</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Business Description</label>
              <textarea
                id="businessDescription"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                rows={3}
              />
            </div>
          </>
        )}

        {/* Expert fields */}
        {formData.role === 'expert' && (
          <>
            <div>
              <label className="text-sm">Specialty</label>
              <TextInput id="specialty" placeholder="Enter your specialty" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm">Years of Experience</label>
              <TextInput id="yearsOfExperience" placeholder="Enter years of experience" onChange={handleChange} required />
            </div>
          </>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}