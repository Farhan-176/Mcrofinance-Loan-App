import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { loanAPI } from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SlipPage = () => {
  const { id } = useParams();
  const [slipData, setSlipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slipRef = useRef();

  useEffect(() => {
    fetchSlipData();
  }, [id]);

  const fetchSlipData = async () => {
    try {
      const response = await loanAPI.generateSlip(id);
      setSlipData(response.data);
      setError(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate slip';
      setError(errorMsg);
      setSlipData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const element = slipRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`Loan-Slip-${slipData.tokenNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-700 mb-4">Unable to Generate Slip</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!slipData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Failed to load slip data</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Loan Application Slip</h1>

        <div ref={slipRef} className="bg-white p-8 rounded-xl shadow-lg border-2 border-primary-200">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-primary-600 pb-6">
            <h2 className="text-3xl font-bold text-primary-700">Saylani Welfare Trust</h2>
            <p className="text-lg text-gray-600">Qarze Hasana Program</p>
            <p className="text-sm text-gray-500 mt-2">Interest-Free Loan Application</p>
          </div>

          {/* Token and QR Code */}
          <div className="flex justify-between items-center mb-8 bg-primary-50 p-6 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Token Number</p>
              <p className="text-3xl font-bold text-primary-700">{slipData.tokenNumber}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              {slipData.qrCode && (
                <img 
                  src={slipData.qrCode} 
                  alt="QR Code" 
                  className="w-[120px] h-[120px]"
                />
              )}
            </div>
          </div>

          {/* Applicant Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary-700">Applicant Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{slipData.applicantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CNIC</p>
                <p className="font-semibold">{slipData.cnic}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary-700">Loan Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{slipData.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subcategory</p>
                <p className="font-semibold">{slipData.subcategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="font-semibold text-xl text-primary-700">
                  PKR {slipData.loanAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          {slipData.appointmentDate && (
            <div className="mb-8 bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">Appointment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">
                    {new Date(slipData.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">{slipData.appointmentTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Office Location</p>
                  <p className="font-semibold">{slipData.officeLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="text-lg font-bold mb-3">Important Instructions</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Please bring this slip on your appointment date</li>
              <li>Bring original CNIC and two copies</li>
              <li>Bring guarantors' documents</li>
              <li>Arrive 15 minutes before your appointment time</li>
              <li>Contact us if you need to reschedule</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Generated on {new Date().toLocaleDateString()}</p>
            <p className="mt-2">For queries, contact: +92-21-111-729-526</p>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 text-center">
          <button onClick={handleDownload} className="btn-primary text-lg px-8 py-4">
            Download Slip as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlipPage;
