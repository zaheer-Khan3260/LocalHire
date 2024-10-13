import React from "react";
import { FaMapMarkerAlt, FaClock, FaTools, FaRupeeSign } from "react-icons/fa";
import userImage from "../../Icons/profile.jpeg";
import { Link } from "react-router-dom";

const WorkerCard = ({
  _id,
  name,
  location,
  profileImage,
  designation,
  onClick,
  handleMessageClick,
}) => {
  const rating = 3.5;

  return (
    <div className="bg-[rgba(14,20,33,0.7)] h-auto rounded-lg shadow-lg overflow-hidden w-[28rem] mx-auto cursor-pointer">
      <div className="relative">
        <img
          className="w-full h-56 object-cover"
          src={profileImage ? profileImage : userImage}
          alt={designation}
        />
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg">
          <p className="text-sm font-semibold">{designation}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex gap-1 items-start" onClick={handleMessageClick}>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">{name}</h2>
          <div className=" text-end h-fit mt-1 p-1 cursor-pointer relative group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-message-circle"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <div className=" absolute top-[-20px] opacity-0 right-0 p-1 text-[11px] group-hover:opacity-100 transition-all duration-500">
              Message
            </div>
          </div>
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span key={index} className="relative">
                <svg
                  className={`w-5 h-5 ${
                    starValue <= Math.floor(rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating % 1 !== 0 && Math.ceil(rating) === starValue && (
                  <svg
                    className="w-5 h-5 text-yellow-400 absolute top-0 left-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ clipPath: "inset(0 50% 0 0)" }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </span>
            );
          })}
          <span className="ml-2 text-gray-300">{rating.toFixed(1)}</span>
        </div>
        <div className="space-y-2 mb-8">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <p className="text-gray-300">{location?.state}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaClock className="text-blue-500 mr-2" />
            <p className="text-sm text-gray-300">Available Now</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClick}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Hire Now
            </button>
            <Link to={`/profile/${_id}`}>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              View Profile
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
