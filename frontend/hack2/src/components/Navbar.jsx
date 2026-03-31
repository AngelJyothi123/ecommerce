import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass-pill rounded-full transition-all duration-300">
      <div className="px-6 w-full">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 flex items-center">
            <svg className="w-8 h-8 mr-2 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            ShopHub
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
              Home
            </Link>

            {isAuthenticated() ? (
              <>
                <Link to="/cart" className="relative text-gray-300 hover:text-fuchsia-400 font-medium transition-colors flex items-center group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-pink-500/50">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Orders
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </div>
                        </Link>
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Admin Dashboard
                            </div>
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-white/10 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-pink-500 hover:bg-white/10 hover:text-pink-400 transition-colors"
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-6 py-2">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
