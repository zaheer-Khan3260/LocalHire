import React from 'react';
import { FaMapMarkerAlt, FaClock, FaTools, FaRupeeSign } from 'react-icons/fa';

const WorkerCard = () => {
  // Random values for profession, location, and price
  const professions = ['Plumber', 'Carpenter', 'Mechanic', 'Cleaner', 'Driver', 'Painter'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];
  const hourlyRates = [250, 300, 350, 400, 450, 500];
  
  const randomProfession = professions[Math.floor(Math.random() * professions.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomHourlyRate = hourlyRates[Math.floor(Math.random() * hourlyRates.length)];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={`https://source.unsplash.com/random/400x300?${randomProfession.toLowerCase()}`} alt={randomProfession} />
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg">
          <p className="text-sm font-semibold">{randomProfession}</p>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Rahul Sharma</h2>
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <p className="text-gray-600">{randomLocation}</p>
          </div>
          <div className="flex items-center">
            <FaRupeeSign className="text-green-500 mr-2" />
            <p className="text-gray-600">{randomHourlyRate} per hour</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaClock className="text-blue-500 mr-2" />
            <p className="text-sm text-gray-500">Available Now</p>
          </div>
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
            Hire Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;


