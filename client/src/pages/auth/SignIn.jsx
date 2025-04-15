// src/pages/auth/SignIn.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../../components/lable';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields.'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/SignIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Login response data:', data);

      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      dispatch(signInSuccess({
        _id: data._id,
        username: data.username,
        email: data.email,
        profilePicture: data.profilePicture,
        role: data.role,
        token: data.token,
      }));

      setFormData({ email: '', password: '' });

      // Role-based redirect
      switch (data.role) {
        case 'supplier':
          navigate('/supplier/dashboard');
          break;
        case 'expert':
          navigate('/expert/dashboard');
          break;
        case 'customer':
        default:
          navigate('/customer/dashboard');
          break;
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen mt-10'>
      <div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-7'>
        {/* left */}
        <div className="flex-1">
          <Link to='/' className='font-bold'>
            <span className='px-2 py-1 bg-gradient-to-r from-blue-800 via-green-800 rounded-lg text-white'>SmartTool</span>
            Market
          </Link>
          <p className='text-sm mt-5'>
            This is a world-best tool machinery digital market and consultation place. Now you can Sign in and get more services.
          </p>
        </div>

        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' htmlFor='email' />
              <TextInput
                type="email"
                placeholder='name@gmail.com'
                id='email'
                onChange={handleChange}
                value={formData.email || ''}
              />
            </div>
            <div>
              <Label value='Your password' htmlFor='password' />
              <TextInput
                type="password"
                placeholder='Enter your password'
                id='password'
                onChange={handleChange}
                value={formData.password || ''}
              />
            </div>
            <Button type='submit'>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't Have an account?</span>
            <Link to="/SignUp" className='text-blue-500'>Sign Up</Link>
          </div>

          {errorMessage && <Alert message={errorMessage} type="error" />}
        </div>
      </div>
    </div>
  );
}