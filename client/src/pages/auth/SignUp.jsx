import React from 'react';// Ensure you have flowbite-react installed
import { Link, useNavigate } from 'react-router-dom';
import Label from '../../components/lable';  // Ensure the import path is correct
import TextInput from '../../components/TextInput';  // Ensure the import path is correct
import Button from '../../components/Button'; // Ensure the import path is correct
import { useState } from 'react'; // Import useState from React
import Alert from '../../components/Alert';
import { Spinner } from 'react-bootstrap';
import OAuth from '../../components/OAuth';


export default function SignUp() {
    const [formData, setFormData] = useState({ role: 'customer' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook
    
    const handleChange = (e) => {
        setErrorMessage('');  // Clear the error message
        setFormData({
          ...formData,
          [e.target.id]: e.target.value.trim(),
        });
      };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!formData.username || !formData.email || !formData.password) {
        return setErrorMessage('Please fill in all fields.');
    }
    try {
        setLoading(true); // Set loading to true when the form is submitted
        setErrorMessage(null); // Clear any previous error messages
        const res = await fetch ('api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.success === false){
            return setErrorMessage(data.message);
        }
                    // Reset the form fields after successful submission
        setFormData({ username: '', email: '', password: '' });
        setLoading(false); // Set loading to false when the request is complete
        if(res.ok){
            navigate('/SignIn'); // Redirect to the home page on successful signup
        }

    }catch (error) {
        setErrorMessage(error.message); // Corrected this line
        setLoading(false); // Set loading to false if an error occurs
    }
  };// Log the form data to see the changes


  return (
    <div className='min-h-screen mt-10'>
      <div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-7'>
        {/* left */}
        <div className="flex-1">
          <Link
            to='/'  
            className='font-bold'>
            <span className='px-2 py-1 bg-gradient-to-r from-blue-800 via-green-800 rounded-lg text-white'>SmartTool </span> 
               Market
          </Link>
          <p className='text-sm mt-5'>
            This is a world-best tool machinery digital market and consultation place. Now you can register for free and get more services.
          </p>
          <p>"If you are a seller or customer, please use this button for registration"</p>
          <Button variant="" className="self-start mt-5 ml-80 px-4 py-1 border border-gray-700 text-gray-800 rounded-md hover:bg-gray-600 hover:text-white transition">
  <Link  to="/Register">Registration</Link>
</Button>

        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' htmlFor='username' />
              <TextInput type="text" placeholder='Enter your username' id='username' onChange={handleChange} value={formData.username} />
            </div>
            <div>
              <Label value='Your email' htmlFor='email' />
              <TextInput type="email" placeholder='name@gmail.com' id='email' onChange={handleChange} value={formData.email} />
            </div>
            <div>
              <Label value='Your password' htmlFor='password' />
              <TextInput type="password" placeholder='Enter your password' id='password' onChange={handleChange} value={formData.password} />
            </div>
            <Button type='submit'>
                {
                loading ? (
                    <>
                <Spinner animation="border" size="sm" />

                <span className='pl-3'>Loading...</span>
                </>
            ) : 'SignUp'
        }
            </Button>
            <OAuth />
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to="/SignIn" className='text-blue-500'>Sign In</Link>
          </div>
          {errorMessage && <Alert message={errorMessage} type="error" />}
        </div>
      </div>
    </div>
  );
}
