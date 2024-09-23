import React, { useState } from 'react';
import { FaSearch, FaBell, FaEnvelope, FaUser, FaChevronDown, FaCheckCircle, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = {
    name: "John Doe",
    isWorker: true,
    isVerified: true,
    profileCompletion: 75
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const getProfileCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">LocalHire</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-purple-200 transition duration-300">Home</a></li>
              <li><a href="/active-workers" className="hover:text-purple-200 transition duration-300">Active Workers</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white bg-opacity-20 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-blue-300 transition duration-300 w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200" />
          </div>
          <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition duration-300">
            <FaBell className="text-xl" />
          </button>
          <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition duration-300">
            <FaEnvelope className="text-xl" />
          </button>
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition duration-300"
            >
              <FaUserCircle className="text-2xl" />
              <FaChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-2xl z-10 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <FaUserCircle className="text-4xl" />
                      <div 
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getProfileCompletionColor(user.profileCompletion)}`}
                        title={`Profile ${user.profileCompletion}% complete`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg flex items-center">
                        {user.name}
                        {user.isWorker && user.isVerified && (
                          <FaCheckCircle className="text-green-300 ml-2" title="Verified Worker" />
                        )}
                      </p>
                      <p className="text-sm text-purple-200">Worker</p>
                    </div>
                  </div>
                </div>
                <a 
                  href="/complete-profile" 
                  className="block px-4 py-3 text-sm hover:bg-gray-100 transition duration-300"
                >
                  Complete Profile
                </a>
                <button 
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition duration-300 text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;




