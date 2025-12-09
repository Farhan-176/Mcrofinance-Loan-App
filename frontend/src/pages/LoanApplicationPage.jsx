import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI, authAPI } from '../utils/api';

const LoanApplicationPage = () => {
  const [step, setStep] = useState(1);
  const [loanData, setLoanData] = useState(null);
  const [loanRequestId, setLoanRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pendingData = localStorage.getItem('pendingLoanData');
    if (pendingData) {
      setLoanData(JSON.parse(pendingData));
    } else {
      navigate('/');
    }
  }, []);

  const [guarantors, setGuarantors] = useState([
    { name: '', email: '', cnic: '', location: '', phoneNumber: '' },
    { name: '', email: '', cnic: '', location: '', phoneNumber: '' },
  ]);

  const [personalInfo, setPersonalInfo] = useState({
    phoneNumber: '',
    street: '',
    city: '',
    country: '',
    zipCode: '',
    additionalInfo: '',
  });

  const [documents, setDocuments] = useState({
    profilePhoto: null,
    cnicFront: null,
    cnicBack: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    profilePhoto: null,
    cnicFront: null,
    cnicBack: null,
  });

  const handleFileChange = (field, file) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviews((prev) => ({ ...prev, [field]: null }));
    }
  };

  const formatCNIC = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
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

  const handleGuarantorChange = (index, field, value) => {
    const updated = [...guarantors];
    if (field === 'cnic') {
      updated[index][field] = formatCNIC(value);
    } else {
      updated[index][field] = value;
    }
    setGuarantors(updated);
  };

  const handleStep1Submit = async () => {
    if (!loanData) return;

    // Validate required fields
    if (!personalInfo.phoneNumber || !personalInfo.street || !personalInfo.city || !personalInfo.country) {
      alert('Please fill in all required fields (Phone Number, Street, City, Country)');
      return;
    }

    // Validate document uploads
    if (!documents.profilePhoto || !documents.cnicFront || !documents.cnicBack) {
      alert('Please upload all required documents (Profile Photo, CNIC Front, CNIC Back)');
      return;
    }

    setLoading(true);
    try {
      const response = await loanAPI.createRequest({
        category: loanData.category,
        subcategory: loanData.subcategory,
        loanAmount: loanData.totalLoan,
        loanPeriod: loanData.periodMonths,
        initialDeposit: loanData.initialDeposit,
        additionalInfo: personalInfo.additionalInfo,
      });

      const createdLoanRequestId = response.data.loanRequest._id;
      setLoanRequestId(createdLoanRequestId);
      
      // Update user profile
      await authAPI.updateProfile({
        phoneNumber: personalInfo.phoneNumber,
        address: {
          street: personalInfo.street,
          city: personalInfo.city,
          country: personalInfo.country,
          zipCode: personalInfo.zipCode,
        },
      });

      // Upload documents if provided
      if (documents.profilePhoto || documents.cnicFront || documents.cnicBack) {
        const formData = new FormData();
        if (documents.profilePhoto) formData.append('profilePhoto', documents.profilePhoto);
        if (documents.cnicFront) formData.append('cnicFront', documents.cnicFront);
        if (documents.cnicBack) formData.append('cnicBack', documents.cnicBack);

        await loanAPI.uploadDocuments(createdLoanRequestId, formData);
      }

      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create loan request');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    // Validate guarantors
    for (let i = 0; i < guarantors.length; i++) {
      const g = guarantors[i];
      if (!g.name || !g.email || !g.cnic || !g.location || !g.phoneNumber) {
        alert(`Please fill in all fields for Guarantor ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      await loanAPI.addGuarantors(loanRequestId, { guarantors });
      localStorage.removeItem('pendingLoanData');
      alert('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add guarantors');
    } finally {
      setLoading(false);
    }
  };

  if (!loanData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Complete Your Loan Application</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex-1 h-2 ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'} rounded`}></div>
            <div className={`mx-2 w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>1</div>
            <div className={`flex-1 h-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'} rounded`}></div>
            <div className={`mx-2 w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>2</div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Personal Information</span>
            <span>Guarantor Details</span>
          </div>
        </div>

        {/* Loan Summary */}
        <div className="card mb-8 bg-primary-50">
          <h2 className="text-xl font-bold mb-4">Loan Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-bold">{loanData.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-bold">PKR {loanData.totalLoan?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Period</p>
              <p className="font-bold">{loanData.periodMonths} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Payment</p>
              <p className="font-bold">PKR {loanData.monthlyInstallment?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={personalInfo.phoneNumber}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    value={personalInfo.street}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, street: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Country</label>
                  <input
                    type="text"
                    value={personalInfo.country}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={personalInfo.zipCode}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, zipCode: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                      className="input-field text-sm"
                    />
                    {imagePreviews.profilePhoto && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.profilePhoto}
                          alt="Profile Preview"
                          className="w-full h-32 object-cover rounded-lg border-2 border-primary-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* CNIC Front */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">CNIC Front</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('cnicFront', e.target.files?.[0] || null)}
                      className="input-field text-sm"
                    />
                    {imagePreviews.cnicFront && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.cnicFront}
                          alt="CNIC Front Preview"
                          className="w-full h-32 object-cover rounded-lg border-2 border-primary-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* CNIC Back */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">CNIC Back</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('cnicBack', e.target.files?.[0] || null)}
                      className="input-field text-sm"
                    />
                    {imagePreviews.cnicBack && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.cnicBack}
                          alt="CNIC Back Preview"
                          className="w-full h-32 object-cover rounded-lg border-2 border-primary-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Additional Information</label>
                <textarea
                  value={personalInfo.additionalInfo}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, additionalInfo: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Any additional information you'd like to share..."
                ></textarea>
              </div>
              <button onClick={handleStep1Submit} disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Next: Add Guarantors'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guarantor Information */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Guarantor Information</h2>
            <p className="text-gray-600 mb-6">Please provide details of two guarantors</p>

            {guarantors.map((guarantor, index) => (
              <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Guarantor {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={guarantor.name}
                      onChange={(e) => handleGuarantorChange(index, 'name', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={guarantor.email}
                      onChange={(e) => handleGuarantorChange(index, 'email', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">CNIC</label>
                    <input
                      type="text"
                      value={guarantor.cnic}
                      onChange={(e) => handleGuarantorChange(index, 'cnic', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      value={guarantor.location}
                      onChange={(e) => handleGuarantorChange(index, 'location', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={guarantor.phoneNumber}
                      onChange={(e) => handleGuarantorChange(index, 'phoneNumber', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleStep2Submit}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationPage;
