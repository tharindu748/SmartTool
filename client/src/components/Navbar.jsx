import React, { useState, useRef, useEffect } from 'react';
import { HiMenuAlt4, HiSearch } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchBarRef = useRef(null);
  const searchIconRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target) &&
        searchIconRef.current &&
        !searchIconRef.current.contains(event.target)
      ) {
        setSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (currentUser?.role === 'supplier') return '/supplier';
    if (currentUser?.role === 'expert') return '/eprofile';
    return null;
  };

  const showDashboard = currentUser?.role === 'supplier' || currentUser?.role === 'expert';

  return (
    <nav className="bg-gradient-to-r from-slate-500 via-red-400 to-slate-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Desktop Links */}
        <div className="space-x-8 hidden md:flex">
          <Link to="/" className="text-black hover:text-gray-300">Home</Link>
          <Link to="/marketplace" className="text-black hover:text-gray-300">Market-place</Link>
          <Link to="/services" className="text-black hover:text-gray-300">Expert-Booking</Link>
          <Link to="/calculation" className="text-black hover:text-gray-300">Technical-Calculations</Link>

          {showDashboard && (
            <Link to={getDashboardLink()} className="text-blue-700 font-semibold">Dashboard</Link>
          )}
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex items-center space-x-4">
          <input type="text" placeholder="Search..." className="p-2 border rounded-md text-black" />
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-400 transition">
            Search
          </button>
        </div>

        {/* Mobile Search Input */}
        <div
          ref={searchBarRef}
          className={`${searchVisible ? 'block' : 'hidden'} lg:hidden absolute top-16 left-0 w-full bg-white p-4 z-20`}
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="bg-yellow-500 text-white px-4 rounded-md hover:bg-yellow-400 transition duration-300">
              Search
            </button>
          </div>
        </div>

        {/* Mobile Search Icon */}
        <div className="md:hidden flex items-center space-x-4">
          <button ref={searchIconRef} onClick={() => setSearchVisible(!searchVisible)} className="text-black">
            <HiSearch size={24} />
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">
            <HiMenuAlt4 size={30} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <div className="md:hidden bg-gray-600 p-4">
          <ul className="space-y-4 text-white">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/marketplace" onClick={() => setMenuOpen(false)}>Market-place</Link></li>
            <li><Link to="/services" onClick={() => setMenuOpen(false)}>Expert-Booking</Link></li>
            <li><Link to="/calculation" onClick={() => setMenuOpen(false)}>Technical-Calculations</Link></li>

            {showDashboard && (
              <li>
                <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
