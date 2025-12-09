import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = (e) => {
    const pendingData = localStorage.getItem('pendingLoanData');
    const isOnApplicationPage = location.pathname === '/loan/apply';
    
    if (pendingData && isOnApplicationPage) {
      e.preventDefault();
      const confirmed = window.confirm(
        'You have an incomplete loan application. Navigating away will cancel this application. Do you want to continue?'
      );
      if (confirmed) {
        localStorage.removeItem('pendingLoanData');
        navigate('/dashboard');
      }
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            onClick={() => {
              if (user?.isAdmin) {
                navigate('/admin');
              } else {
                navigate('/');
              }
            }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="text-2xl font-bold text-primary-700">
              Saylani Welfare
            </div>
            <div className="text-sm text-gray-600">Qarze Hasana</div>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {!user?.isAdmin && (
                  <Link 
                    to="/dashboard" 
                    onClick={handleDashboardClick}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
                  >
                    <FaUserCircle className="text-2xl" />
                    <span>{user?.name}</span>
                    <FaChevronDown className={`text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/change-password');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors font-semibold">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
