import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';


export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);



  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <header className="border-b shadow-sm bg-gradient-to-r from-indigo-300 via-red-400 to-slate-400 text-black">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          <span className="bg-gradient-to-r from-indigo-900 via-gray-500 to-gray-700 text-white px-2 py-1 rounded-lg">
            Smart
          </span>{' '}
          Tool
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Auth / Avatar */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full border overflow-hidden focus:outline-none"
              >
                <img
                  src={currentUser.profilePicture || '/default-avatar.png'}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold">@{currentUser.username}</p>
                    <p className="text-sm truncate">{currentUser.email}</p>
                  </div>
                  <Link
                      to={
                        currentUser.role === 'supplier'
                          ? '/supplier'
                          : currentUser.role === 'expert'
                          ? '/eprofile'
                          : '/dashboard?tab=profile'
                      }
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                  <button
                    onClick={handleSignout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/SignUp"
              className="px-4 py-1 border border-gray-700 text-gray-800 rounded-md hover:bg-gray-600 hover:text-white transition"
            >
              Sign In
            </Link>
          )}


        </div>
      </div>

    </header>
  );
}
