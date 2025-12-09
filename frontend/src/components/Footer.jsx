import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Saylani Welfare</h3>
            <p className="text-gray-400">
              Providing interest-free loans (Qarze Hasana) to support those in need.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Loan Categories</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Wedding Loans</li>
              <li>Home Construction Loans</li>
              <li>Business Startup Loans</li>
              <li>Education Loans</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: info@saylani.org.pk<br />
              Phone: +92-21-111-729-526
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Saylani Welfare Trust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
