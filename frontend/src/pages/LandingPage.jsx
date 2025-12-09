import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoanCalculator from '../components/LoanCalculator';
import { FaCheckCircle, FaHandHoldingUsd, FaHome, FaStore, FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loanData, setLoanData] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleProceed = (formData, calculation) => {
    const calculatedData = { ...formData, ...calculation };
    setLoanData(calculatedData);
    
    // If user is already logged in, skip registration and go directly to application
    // But block admins from applying for loans
    if (isAuthenticated) {
      if (user?.isAdmin) {
        alert('Admins cannot apply for loans. Please use a regular user account.');
        return;
      }
      localStorage.setItem('pendingLoanData', JSON.stringify(calculatedData));
      navigate('/loan/apply');
    } else {
      setShowModal(true);
    }
  };

  const categories = [
    {
      icon: <FaCheckCircle className="text-5xl text-primary-600" />,
      title: 'Wedding Loans',
      description: 'Support for wedding expenses',
      maxAmount: 'PKR 5 Lakh',
      period: '3 Years',
    },
    {
      icon: <FaHome className="text-5xl text-primary-600" />,
      title: 'Home Construction',
      description: 'Build your dream home',
      maxAmount: 'PKR 10 Lakh',
      period: '5 Years',
    },
    {
      icon: <FaStore className="text-5xl text-primary-600" />,
      title: 'Business Startup',
      description: 'Start your own business',
      maxAmount: 'PKR 10 Lakh',
      period: '5 Years',
    },
    {
      icon: <FaGraduationCap className="text-5xl text-primary-600" />,
      title: 'Education Loans',
      description: 'Invest in education',
      maxAmount: 'Based on requirement',
      period: '4 Years',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Qarze Hasana Program</h1>
          <p className="text-xl mb-8">Interest-free loans to support your dreams</p>
          <button
            onClick={() => document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Loan Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">{cat.icon}</div>
              <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
              <p className="text-gray-600 mb-4">{cat.description}</p>
              <div className="text-sm text-gray-500">
                <p>Max: {cat.maxAmount}</p>
                <p>Period: {cat.period}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculator Section */}
      <div id="calculator" className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <LoanCalculator onProceed={handleProceed} />
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <RegistrationModal
          loanData={loanData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Registration Modal Component
const RegistrationModal = ({ loanData, onClose }) => {
  const [formData, setFormData] = useState({
    cnic: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    const formatCNIC = (value) => {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
    
      // Format as xxxxx-xxxxxxx-x
      let formatted = '';
      if (digitsOnly.length <= 5) {
        formatted = digitsOnly;
      } else if (digitsOnly.length <= 12) {
        formatted = digitsOnly.slice(0, 5) + '-' + digitsOnly.slice(5);
      } else {
        formatted = digitsOnly.slice(0, 5) + '-' + digitsOnly.slice(5, 12) + '-' + digitsOnly.slice(12, 13);
      }
    
      return formatted;
    };

    const handleCNICChange = (e) => {
      const formatted = formatCNIC(e.target.value);
      setFormData({ ...formData, cnic: formatted });
    };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { authAPI } = await import('../utils/api');
      const { confirmPassword, ...registrationData } = formData;
      await authAPI.register(registrationData);
      
      // Store loan data for later use
      localStorage.setItem('pendingLoanData', JSON.stringify(loanData));
      
      alert('Registration successful! You can now login with your credentials.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Register to Continue</h2>
        <p className="text-gray-600 mb-6">
          Please provide your details to create an account and proceed with your loan application.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">CNIC</label>
            <input
              type="text"
              value={formData.cnic}
              onChange={handleCNICChange}
              className="input-field"
              placeholder="12345-1234567-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPasswords.password ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field pr-10"
                placeholder="Choose a password (min 6 characters)"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, password: !showPasswords.password })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.password ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field pr-10"
                placeholder="Re-enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Registering...' : 'Register'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary-600 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
