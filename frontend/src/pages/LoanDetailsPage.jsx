import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanAPI } from '../utils/api';

const LoanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loanRequest, setLoanRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await loanAPI.getRequest(id);
      setLoanRequest(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch loan details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!loanRequest) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Loan request not found</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Loan Application Details</h1>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(loanRequest.status)}`}>
            Status: {loanRequest.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Loan Information */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4 text-primary-700">Loan Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="text-lg font-semibold">{loanRequest.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Subcategory</p>
              <p className="text-lg font-semibold">{loanRequest.subcategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="text-lg font-semibold">PKR {loanRequest.loanAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Initial Deposit</p>
              <p className="text-lg font-semibold">PKR {loanRequest.initialDeposit?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Period</p>
              <p className="text-lg font-semibold">{loanRequest.loanPeriod} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Installment</p>
              <p className="text-lg font-semibold">PKR {loanRequest.monthlyInstallment?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Token Number</p>
              <p className="text-lg font-semibold">{loanRequest.tokenNumber || 'Not assigned yet'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Application Date</p>
              <p className="text-lg font-semibold">
                {new Date(loanRequest.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Details (if approved) */}
        {loanRequest.tokenNumber && (
          <div className="card mb-6 bg-green-50">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Appointment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold">
                  {loanRequest.appointmentDate 
                    ? new Date(loanRequest.appointmentDate).toLocaleDateString()
                    : 'Not scheduled yet'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-lg font-semibold">{loanRequest.appointmentTime || 'Not scheduled yet'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Office Location</p>
                <p className="text-lg font-semibold">{loanRequest.officeLocation || 'Not assigned yet'}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate(`/loan/${id}/slip`)}
                className="btn-primary"
              >
                Download Appointment Slip
              </button>
            </div>
          </div>
        )}

        {/* Guarantor Information */}
        {loanRequest.guarantors && loanRequest.guarantors.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Guarantor Information</h2>
            {loanRequest.guarantors.map((guarantor, index) => (
              <div key={guarantor._id} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Guarantor {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{guarantor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{guarantor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CNIC</p>
                    <p className="font-semibold">{guarantor.cnic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold">{guarantor.phoneNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{guarantor.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Documents */}
        {(loanRequest.documents?.profilePhoto || loanRequest.documents?.cnicFront || loanRequest.documents?.cnicBack) && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loanRequest.documents?.profilePhoto && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Profile Photo</p>
                  <img
                    src={`http://localhost:5000${loanRequest.documents.profilePhoto}`}
                    alt="Profile"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
              {loanRequest.documents?.cnicFront && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">CNIC Front</p>
                  <img
                    src={`http://localhost:5000${loanRequest.documents.cnicFront}`}
                    alt="CNIC Front"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
              {loanRequest.documents?.cnicBack && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">CNIC Back</p>
                  <img
                    src={`http://localhost:5000${loanRequest.documents.cnicBack}`}
                    alt="CNIC Back"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {loanRequest.additionalInfo && (
          <div className="card mt-6">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Additional Information</h2>
            <p className="text-gray-700">{loanRequest.additionalInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetailsPage;
