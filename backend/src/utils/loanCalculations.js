const loanCategories = {
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
    maxAmount: null, // Based on requirement
    periodYears: 4
  }
};

const calculateLoan = (loanAmount, initialDeposit, periodMonths) => {
  const remainingAmount = loanAmount - initialDeposit;
  const monthlyInstallment = Math.ceil(remainingAmount / periodMonths);
  
  return {
    totalLoan: loanAmount,
    initialDeposit,
    remainingAmount,
    periodMonths,
    monthlyInstallment,
    totalPayable: initialDeposit + (monthlyInstallment * periodMonths)
  };
};

module.exports = { loanCategories, calculateLoan };
