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
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields.'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return dispatch(signInFailure(data.message || 'Login failed'));

      dispatch(signInSuccess({
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
      }));

      switch (data.user.role) {
        case 'supplier':
          navigate('/supplier/dashboard');
          break;
        case 'expert':
          navigate('/expert/dashboard');
          break;
        default:
          navigate('/');
          break;
      }

    } catch (error) {
      dispatch(signInFailure('Login failed. Please try again.'));
    }
  };

  return (
    <div className='min-h-screen mt-10'>
      <form className='max-w-lg mx-auto' onSubmit={handleSubmit}>
        <Label value='Email' htmlFor='email' />
        <TextInput id='email' type='email' onChange={handleChange} required />

        <Label value='Password' htmlFor='password' />
        <TextInput id='password' type='password' onChange={handleChange} required />

        <Button type='submit' disabled={loading}>
          {loading ? <Spinner size='sm' /> : 'Sign In'}
        </Button>

        {errorMessage && <Alert type='error' message={errorMessage} />}
        <Link to='/signup'>Sign Up</Link>
      </form>
    </div>
  );
}
