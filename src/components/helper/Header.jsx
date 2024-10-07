import React from 'react';
import { FaSearch } from 'react-icons/fa';
const Header = () => {

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">LocalHire</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white bg-opacity-20 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-blue-300 transition duration-300 w-[25rem]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;




