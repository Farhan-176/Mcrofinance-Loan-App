import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEye, FaFilter } from 'react-icons/fa';

const Dashboard = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoanRequests();
    checkPendingLoanData();
  }, []);

  const checkPendingLoanData = () => {
    const pendingData = localStorage.getItem('pendingLoanData');
    if (pendingData) {
      navigate('/loan/apply');
    }
  };

  const fetchLoanRequests = async () => {
    try {
      const response = await loanAPI.getUserRequests();
      // Ensure response.data is an array
      const requests = Array.isArray(response.data) ? response.data : [];
      setLoanRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Failed to fetch loan requests:', error);
      setLoanRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...loanRequests];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(req => req.category === filters.category);
    }

    // Filter by search (token number or loan amount)
    if (filters.search) {
      filtered = filtered.filter(req => 
        req.tokenNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.loanAmount?.toString().includes(filters.search)
      );
    }

    setFilteredRequests(filtered);
  }, [filters, loanRequests]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'all', category: 'all', search: '' });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'under-review': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Manage your loan applications here</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => {
            localStorage.removeItem('pendingLoanData');
            navigate('/');
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Apply for New Loan
        </button>
      </div>

      {/* Filters Section */}
      {loanRequests.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-primary-600" />
            <h2 className="text-lg font-semibold">Filter Applications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Wedding Loans">Wedding Loans</option>
                <option value="Home Construction Loans">Home Construction</option>
                <option value="Business Startup Loans">Business Startup</option>
                <option value="Education Loans">Education Loans</option>
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Token number or amount"
                className="input-field"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRequests.length} of {loanRequests.length} applications
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : loanRequests.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">You haven't applied for any loans yet.</p>
          <button onClick={() => {
            localStorage.removeItem('pendingLoanData');
            navigate('/');
          }} className="btn-primary">
            Apply Now
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No applications match your filters.</p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <div key={request._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{request.category}</h3>
                  <p className="text-gray-600">{request.subcategory}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                  {request.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="font-bold">PKR {request.loanAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Period</p>
                  <p className="font-bold">{request.loanPeriod} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="font-bold">PKR {request.monthlyInstallment?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Token Number</p>
                  <p className="font-bold">{request.tokenNumber || 'Not assigned'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/loan/${request._id}`)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaEye /> View Details
                </button>
                {request.tokenNumber && (
                  <button
                    onClick={() => navigate(`/loan/${request._id}/slip`)}
                    className="btn-secondary"
                  >
                    Download Slip
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
