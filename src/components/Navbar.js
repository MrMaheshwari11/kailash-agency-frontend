import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import useLogout from '../context/useLogout'; // ✅ Import logout hook

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const logout = useLogout(); // ✅ Use hook
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();            // ✅ Clean logout
    setIsOpen(false);    // ✅ Close menu on mobile
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition duration-300">
          Kailash Agency
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-700 md:bg-transparent p-4 md:p-0 transition-all duration-300`}
        >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
          >
            Home
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="block md:inline-block text-lg hover:text-blue-200 relative transition duration-300 mb-2 md:mb-0"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
              >
                Orders
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block md:inline-block text-lg hover:text-blue-200 transition duration-300 mb-2 md:mb-0"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
