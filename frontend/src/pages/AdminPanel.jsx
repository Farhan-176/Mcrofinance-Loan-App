import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { FaFilter, FaSearch, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    country: '',
    status: '',
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [appsResponse, statsResponse] = await Promise.all([
        adminAPI.getApplications(filters),
        adminAPI.getStats(),
      ]);
      setApplications(appsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await adminAPI.updateStatus(appId, { status: newStatus });
      fetchData();
      alert('Status updated successfully');
    } catch (error) {
      alert('Failed to update status');
    }
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
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-sm opacity-90">Total Applications</p>
            <p className="text-4xl font-bold">{stats.totalApplications}</p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <p className="text-sm opacity-90">Pending</p>
            <p className="text-4xl font-bold">{stats.pendingApplications}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <p className="text-sm opacity-90">Approved</p>
            <p className="text-4xl font-bold">{stats.approvedApplications}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <p className="text-sm opacity-90">Total Loan Amount</p>
            <p className="text-3xl font-bold">PKR {stats.totalLoanAmount?.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <FaFilter className="text-primary-600" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-primary text-sm px-4 py-2"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? '' : 'hidden md:grid'}`}>
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Country"
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="input-field"
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setFilters({ city: '', country: '', status: '' })}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4">Token</th>
                <th className="text-left p-4">Applicant</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">
                    {app.tokenNumber || 'N/A'}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{app.userId?.name}</p>
                      <p className="text-sm text-gray-600">{app.userId?.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{app.category}</p>
                    <p className="text-sm text-gray-600">{app.subcategory}</p>
                  </td>
                  <td className="p-4 font-bold">
                    PKR {app.loanAmount?.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm">
                    <p>{app.userId?.address?.city}</p>
                    <p className="text-gray-600">{app.userId?.address?.country}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewDetails(app)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No applications found
            </div>
          )}
        </div>
      )}

      {/* Application Details Modal */}
      {showModal && selectedApp && (
        <ApplicationModal
          application={selectedApp}
          onClose={() => setShowModal(false)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};

// Application Modal Component
const ApplicationModal = ({ application, onClose, onUpdate }) => {
  const [tokenData, setTokenData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    officeLocation: 'Saylani Welfare Office, Karachi',
  });
  const [loading, setLoading] = useState(false);

  const handleAssignToken = async () => {
    setLoading(true);
    try {
      await adminAPI.assignToken(application._id, tokenData);
      alert('Token and appointment assigned successfully');
      onUpdate();
      onClose();
    } catch (error) {
      alert('Failed to assign token');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await adminAPI.updateStatus(application._id, { status: newStatus });
      alert('Status updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full my-8">
        <h2 className="text-3xl font-bold mb-6 text-primary-700">Application Details</h2>

        {/* Applicant Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Applicant Information</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{application.userId?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{application.userId?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CNIC</p>
              <p className="font-semibold">{application.userId?.cnic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{application.userId?.phoneNumber || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold">
                {application.userId?.address?.street}, {application.userId?.address?.city},{' '}
                {application.userId?.address?.country}
              </p>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Loan Details</h3>
          <div className="grid grid-cols-2 gap-4 bg-primary-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold">{application.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Subcategory</p>
              <p className="font-semibold">{application.subcategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="font-semibold text-xl">PKR {application.loanAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Period</p>
              <p className="font-semibold">{application.loanPeriod} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Initial Deposit</p>
              <p className="font-semibold">PKR {application.initialDeposit?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Installment</p>
              <p className="font-semibold">PKR {application.monthlyInstallment?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Guarantors */}
        {application.guarantors && application.guarantors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Guarantors</h3>
            {application.guarantors.map((guarantor, idx) => (
              <div key={guarantor._id} className="bg-gray-50 p-4 rounded-lg mb-3">
                <p className="font-semibold mb-2">Guarantor {idx + 1}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-600">Name:</span> {guarantor.name}</p>
                  <p><span className="text-gray-600">Email:</span> {guarantor.email}</p>
                  <p><span className="text-gray-600">CNIC:</span> {guarantor.cnic}</p>
                  <p><span className="text-gray-600">Location:</span> {guarantor.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Documents */}
        {(application.documents?.profilePhoto || application.documents?.cnicFront || application.documents?.cnicBack) && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {application.documents?.profilePhoto && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Profile Photo</p>
                  <img
                    src={`http://localhost:5000${application.documents.profilePhoto}`}
                    alt="Profile"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-primary-500 transition-colors"
                    onClick={() => window.open(`http://localhost:5000${application.documents.profilePhoto}`, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">Click to view full size</p>
                </div>
              )}
              {application.documents?.cnicFront && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">CNIC Front</p>
                  <img
                    src={`http://localhost:5000${application.documents.cnicFront}`}
                    alt="CNIC Front"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-primary-500 transition-colors"
                    onClick={() => window.open(`http://localhost:5000${application.documents.cnicFront}`, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">Click to view full size</p>
                </div>
              )}
              {application.documents?.cnicBack && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">CNIC Back</p>
                  <img
                    src={`http://localhost:5000${application.documents.cnicBack}`}
                    alt="CNIC Back"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-primary-500 transition-colors"
                    onClick={() => window.open(`http://localhost:5000${application.documents.cnicBack}`, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">Click to view full size</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Token Assignment */}
        {!application.tokenNumber && (
          <div className="mb-6 bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
            <h3 className="text-xl font-bold mb-4">Assign Token & Appointment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Appointment Date</label>
                <input
                  type="date"
                  value={tokenData.appointmentDate}
                  onChange={(e) => setTokenData({ ...tokenData, appointmentDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Appointment Time</label>
                <input
                  type="time"
                  value={tokenData.appointmentTime}
                  onChange={(e) => setTokenData({ ...tokenData, appointmentTime: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Office Location</label>
                <input
                  type="text"
                  value={tokenData.officeLocation}
                  onChange={(e) => setTokenData({ ...tokenData, officeLocation: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <button
              onClick={handleAssignToken}
              disabled={loading}
              className="btn-primary mt-4"
            >
              {loading ? 'Assigning...' : 'Assign Token & Schedule'}
            </button>
          </div>
        )}

        {/* Token Info */}
        {application.tokenNumber && (
          <div className="mb-6 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Token Number</p>
            <p className="text-2xl font-bold text-primary-700">{application.tokenNumber}</p>
            {application.appointmentDate && (
              <div className="mt-2 text-sm">
                <p><span className="font-semibold">Date:</span> {new Date(application.appointmentDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Time:</span> {application.appointmentTime}</p>
              </div>
            )}
          </div>
        )}

        {/* Status Actions */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Update Status</h3>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleStatusChange('under-review')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Under Review
            </button>
            <button
              onClick={() => handleStatusChange('approved')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Complete
            </button>
          </div>
        </div>

        <button onClick={onClose} className="btn-secondary w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
