import React, { useState, useEffect } from 'react';
import { loanAPI } from '../utils/api';

const LoanCalculator = ({ onProceed }) => {
  // Fallback categories in case API fails
  const defaultCategories = {
    'Wedding Loans': {
      subcategories: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
      maxAmount: 500000,
      periodYears: 3
    },
    'Home Construction Loans': {
      subcategories: ['Structure', 'Finishing', 'Loan'],
      maxAmount: 1000000,
      periodYears: 5
    },
    'Business Startup Loans': {
      subcategories: ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
      maxAmount: 1000000,
      periodYears: 5
    },
    'Education Loans': {
      subcategories: ['University Fees', 'Child Fees Loan'],
      maxAmount: null,
      periodYears: 4
    }
  };

  const [categories, setCategories] = useState(defaultCategories);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    loanAmount: '',
    initialDeposit: '',
    periodMonths: '',
  });
  const [calculation, setCalculation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await loanAPI.getCategories();
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories from API:', error);
      console.log('Using default categories');
      setCategories(defaultCategories);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { subcategory: '' }),
    }));
    setCalculation(null);
    setError('');
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { subcategory: '' }),
      loanAmount: '',
      initialDeposit: '',
      periodMonths: '',
    }));
    setCalculation(null);
    setError('');
  };

  const handleSubcategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      loanAmount: '',
      initialDeposit: '',
      periodMonths: '',
    }));
    setCalculation(null);
    setError('');
  };

  const handleCalculate = async () => {
    setError('');
    
    if (!formData.category || !formData.loanAmount || !formData.initialDeposit || !formData.periodMonths) {
      setError('Please fill all fields');
      return;
    }

    const loanAmount = Number(formData.loanAmount);
    const periodMonths = Number(formData.periodMonths);
    
    // Validate loan amount
    if (selectedCategory?.maxAmount && loanAmount > selectedCategory.maxAmount) {
      const errorMsg = `Loan amount cannot exceed PKR ${selectedCategory.maxAmount.toLocaleString()} for ${formData.category}`;
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    // Validate loan period
    if (selectedCategory?.periodYears) {
      const maxMonths = selectedCategory.periodYears * 12;
      if (periodMonths > maxMonths) {
        const errorMsg = `Loan period cannot exceed ${selectedCategory.periodYears} years (${maxMonths} months) for ${formData.category}`;
        setError(errorMsg);
        alert(errorMsg);
        return;
      }
    }

    try {
      const response = await loanAPI.calculateLoan({
        category: formData.category,
        loanAmount,
        initialDeposit: Number(formData.initialDeposit),
        periodMonths,
      });
      setCalculation(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Calculation failed');
    }
  };

  const selectedCategory = categories[formData.category];

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-700">
        Loan Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold mb-2">Loan Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="input-field"
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selection */}
        <div>
          <label className="block text-sm font-semibold mb-2">Subcategory</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleSubcategoryChange}
            className="input-field"
            disabled={!formData.category}
          >
            <option value="">Select Subcategory</option>
            {selectedCategory?.subcategories?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Loan Amount (PKR)
            {selectedCategory?.maxAmount && (
              <span className="text-xs text-gray-500 ml-2">
                Max: {selectedCategory.maxAmount.toLocaleString()}
              </span>
            )}
          </label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter loan amount"
          />
        </div>

        {/* Initial Deposit */}
        <div>
          <label className="block text-sm font-semibold mb-2">Initial Deposit (PKR)</label>
          <input
            type="number"
            name="initialDeposit"
            value={formData.initialDeposit}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter initial deposit"
          />
        </div>

        {/* Loan Period */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Loan Period (Months)
            {selectedCategory?.periodYears && (
              <span className="text-xs text-gray-500 ml-2">
                Max: {selectedCategory.periodYears * 12} months
              </span>
            )}
          </label>
          <input
            type="number"
            name="periodMonths"
            value={formData.periodMonths}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter period in months"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="mt-6 flex justify-center">
        <button onClick={handleCalculate} className="btn-primary">
          Calculate
        </button>
      </div>

      {/* Calculation Results */}
      {calculation && (
        <div className="mt-8 p-6 bg-primary-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-primary-800">Loan Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Loan Amount</p>
              <p className="text-2xl font-bold text-primary-700">
                PKR {calculation.totalLoan?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Initial Deposit</p>
              <p className="text-2xl font-bold text-primary-700">
                PKR {calculation.initialDeposit?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Remaining Amount</p>
              <p className="text-2xl font-bold text-primary-700">
                PKR {calculation.remainingAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Monthly Installment</p>
              <p className="text-2xl font-bold text-primary-700">
                PKR {calculation.monthlyInstallment?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onProceed(formData, calculation)}
              className="btn-primary"
            >
              Proceed with Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
