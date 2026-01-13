import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/Auth";
import WalletInfo from "./WalletInfo";
import { FiHome, FiMenu, FiX, FiLogOut, FiLogIn, FiCalendar } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-700">
                  SkyJet
                </span>
                <p className="text-xs text-gray-500">Flight Booking</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links */}
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            
            <Link
              to="/booking-history"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              My Bookings
            </Link>

            {/* Wallet Info */}
            <div className="mx-4">
              <WalletInfo />
            </div>

            {/* User Info */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">Welcome</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-200 ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-4">
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-2 mb-6">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <FiHome className="w-5 h-5 mr-3 text-gray-500" />
              Home
            </Link>
            
            <Link
              to="/booking-history"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <FiCalendar className="w-5 h-5 mr-3 text-gray-500" />
              My Bookings
            </Link>
          </div>

          {/* Wallet Info */}
          <div className="mb-6">
            <WalletInfo />
          </div>

          {/* Login/Logout */}
          <div className="border-t border-gray-200 pt-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <FiLogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiLogIn className="w-5 h-5 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;