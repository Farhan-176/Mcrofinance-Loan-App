# Contributing to Saylani Microfinance App

Thank you for your interest in contributing to the Saylani Microfinance application! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize the user experience
- Maintain code quality and documentation
- Follow Islamic principles (Halal, interest-free)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB 5+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```powershell
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/saylani-microfinance.git
   cd saylani-microfinance
   ```

2. **Install dependencies**
   ```powershell
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Setup environment files**
   ```powershell
   # Backend
   cd ../backend
   Copy-Item .env.example .env
   
   # Frontend
   cd ../frontend
   Copy-Item .env.example .env
   ```

4. **Start development servers**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Creating a Branch

```powershell
# Update your local repository
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bugfix
git checkout -b bugfix/issue-description
```

## Coding Standards

### JavaScript/React

```javascript
// ✅ Good - Use const/let, arrow functions
const calculateLoan = (amount, period) => {
  const monthlyInstallment = amount / period;
  return monthlyInstallment;
};

// ❌ Bad - Avoid var
var result = calculateLoan();

// ✅ Good - Destructuring
const { name, email } = user;

// ❌ Bad
const name = user.name;
const email = user.email;

// ✅ Good - Template literals
const message = `Welcome ${name}!`;

// ❌ Bad
const message = 'Welcome ' + name + '!';
```

### React Components

```jsx
// ✅ Good - Functional components with hooks
import React, { useState, useEffect } from 'react';

const LoanCard = ({ loan }) => {
  const [status, setStatus] = useState('pending');
  
  useEffect(() => {
    // Effect logic
  }, [loan]);
  
  return (
    <div className="card">
      <h3>{loan.category}</h3>
      <p>Amount: PKR {loan.amount.toLocaleString()}</p>
    </div>
  );
};

export default LoanCard;

// ❌ Bad - Class components (avoid unless necessary)
class LoanCard extends React.Component {
  // ...
}
```

### Backend Structure

```javascript
// ✅ Good - Async/await with try-catch
const createLoan = async (req, res) => {
  try {
    const loan = await LoanRequest.create(req.body);
    res.status(201).json({ loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Bad - Callbacks
const createLoan = (req, res) => {
  LoanRequest.create(req.body, (err, loan) => {
    if (err) return res.status(500).json({ message: err });
    res.status(201).json({ loan });
  });
};
```

### CSS/Tailwind

```jsx
// ✅ Good - Tailwind classes, semantic naming
<button className="btn-primary px-6 py-3 rounded-lg hover:bg-primary-700">
  Submit
</button>

// ✅ Good - Conditional classes
<div className={`card ${isActive ? 'bg-primary-50' : 'bg-gray-50'}`}>
  Content
</div>

// ❌ Bad - Inline styles (avoid unless dynamic)
<button style={{ padding: '12px', backgroundColor: '#4caf50' }}>
  Submit
</button>
```

### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
const calculateTotal = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_LOAN_AMOUNT = 1000000;
const API_BASE_URL = 'http://localhost:5000';

// Components: PascalCase
const LoanCalculator = () => {};
const UserDashboard = () => {};

// Files: Match component/function name
// LoanCalculator.jsx
// userService.js
// authController.js
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good commit messages
git commit -m "feat(loan): add loan calculator component"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(api): update authentication endpoints"

# Detailed commit with body
git commit -m "feat(admin): add token assignment feature

- Add token generation utility
- Create appointment scheduling form
- Update admin panel UI
- Add API endpoint for token assignment

Closes #123"
```

### Commit Best Practices

- Keep commits atomic (one logical change)
- Write clear, descriptive messages
- Reference issues when applicable
- Don't commit sensitive data (.env files)

## Pull Request Process

### Before Creating PR

1. **Update from develop**
   ```powershell
   git checkout develop
   git pull origin develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Run tests and linting**
   ```powershell
   # Backend
   cd backend
   npm test
   npm run lint
   
   # Frontend
   cd frontend
   npm test
   npm run lint
   ```

3. **Test your changes**
   - Manual testing
   - Check console for errors
   - Test on different browsers
   - Verify mobile responsiveness

### Creating Pull Request

1. **Push your branch**
   ```powershell
   git push origin feature/your-feature-name
   ```

2. **Open PR on GitHub**
   - Base branch: `develop`
   - Compare branch: `feature/your-feature-name`

3. **Fill PR template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tested locally
   - [ ] Added unit tests
   - [ ] Tested on mobile
   
   ## Screenshots (if applicable)
   [Add screenshots]
   
   ## Related Issues
   Closes #123
   ```

### PR Review Checklist

- Code follows style guidelines
- No console.log() in production code
- No commented-out code
- Proper error handling
- Loading states implemented
- Responsive design
- Accessibility considered
- Documentation updated

## Testing

### Backend Tests

```javascript
// Example test
describe('Loan Calculator', () => {
  test('calculates monthly installment correctly', () => {
    const result = calculateLoan(300000, 50000, 24);
    expect(result.monthlyInstallment).toBe(10417);
  });
});
```

### Frontend Tests

```javascript
import { render, screen } from '@testing-library/react';
import LoanCalculator from './LoanCalculator';

test('renders loan calculator', () => {
  render(<LoanCalculator />);
  const heading = screen.getByText(/Loan Calculator/i);
  expect(heading).toBeInTheDocument();
});
```

### Running Tests

```powershell
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Documentation

### Code Comments

```javascript
// ✅ Good - Explain WHY, not WHAT
// Calculate installment without interest (Qarze Hasana principle)
const monthlyInstallment = remainingAmount / periodMonths;

// ❌ Bad - Obvious comment
// Divide remaining amount by period months
const monthlyInstallment = remainingAmount / periodMonths;

/**
 * Calculate loan breakdown for Qarze Hasana program
 * @param {number} loanAmount - Total loan amount in PKR
 * @param {number} initialDeposit - Down payment in PKR
 * @param {number} periodMonths - Loan period in months
 * @returns {Object} Loan breakdown with monthly installment
 */
const calculateLoan = (loanAmount, initialDeposit, periodMonths) => {
  // Implementation
};
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Updating dependencies
- Modifying API endpoints

### API Documentation

Update API_DOCUMENTATION.md for:
- New endpoints
- Changed request/response formats
- New error codes
- Updated authentication

## Common Issues

### Git Issues

```powershell
# Undo last commit (keep changes)
git reset HEAD~1

# Discard all local changes
git checkout .

# Update fork with upstream
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git checkout develop
git merge upstream/develop
```

### Development Issues

```powershell
# Clear npm cache
npm cache clean --force

# Delete and reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Reset database
mongo
use saylani-microfinance
db.dropDatabase()
```

## Feature Requests

### Proposing New Features

1. Check existing issues
2. Create detailed proposal
3. Discuss with maintainers
4. Get approval before implementation

### Feature Proposal Template

```markdown
## Feature Title

### Problem Statement
Describe the problem this feature solves

### Proposed Solution
Detailed description of your solution

### Alternatives Considered
Other approaches you've thought about

### Additional Context
Mockups, examples, references
```

## Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Screenshots
If applicable

### Environment
- OS: Windows 11
- Browser: Chrome 120
- Node version: 18.x
```

## Code Review Guidelines

### For Authors

- Keep PRs small and focused
- Respond to feedback promptly
- Be open to suggestions
- Test your changes thoroughly

### For Reviewers

- Be constructive and respectful
- Explain reasoning for changes
- Approve when satisfied
- Test the changes locally

## Resources

### Learning Materials

- [React Documentation](https://react.dev)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB University](https://university.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Features List](./FEATURES.md)

## Questions?

- Open an issue for general questions
- Tag maintainers for urgent matters
- Check existing documentation first
- Be patient and respectful

---

## Thank You!

Your contributions help make Saylani Welfare's Qarze Hasana program better for everyone. Every contribution, no matter how small, is valuable.

**May Allah reward your efforts! 🤲**
