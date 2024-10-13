import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import useFetchCurrentUserData from '../../hooks/useFetchCurrentUserData.js';
import { api } from '../../utils/api.js';
import { useParams } from 'react-router';
import EditableComponent from '../helper/EditableComponent.jsx';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const { _id } = useParams();
  const currentUserData = useFetchCurrentUserData();

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const response = await api.get(`/api/user/${id}`);
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUserData && currentUserData.id !== _id) {
      fetchUserData(_id);
    } else if (currentUserData) {
      setUserData(currentUserData);
    }
  }, [currentUserData, _id]);

  const handleFieldChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
    ...Object.fromEntries(Object.entries(userData).filter(([key]) => !['_id', 'profile'].includes(key)))
    }
    const response = await api.patch(`/api/user/${userData?._id}`, updatedData)
    if(response) {
      window.location.reload()
    }
  };

  if (!userData) return <div className="text-white text-center mt-8">Loading...</div>;

  return (
    <div className="w-full mx-auto border p-6 h-[calc(100vh-6.5rem)] rounded-lg shadow-lg transition-transform transform mt-8 ml-4 px-20 overflow-auto scrollbar-hidden">
      <div className="flex items-center mb-6 border-b pb-4 border-gray-700">
        <img src={userData.profileImage || "/api/placeholder/100/100"} alt="Profile" className="w-24 h-24 rounded-full mr-4 shadow-md" />
        <div className="flex-grow">
          <div className='flex gap-2 items-end'>
          <h2 className="text-2xl font-semibold text-white">{userData.name}</h2>
          <div className={`${userData?.verified ? "text-green-500" : "text-gray-500"} relative group cursor-pointer`}>
                    <div className={`border group-hover:opacity-100 opacity-0  px-2 py-1 text-sm transition-all duration-700
                    rounded-xl absolute top-[-35px] left-0 ${userData?.verified ? "w-fit" : "w-24"}`}>{userData?.verified ? "Verified" : "Not Verified"}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Verified user">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
          </div>
          <div className={`items-center my-2 ${userData?.role === "worker" ? "flex" : "hidden"}`}>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span key={index} className="relative">
                  <svg
                    className={`w-5 h-5 ${
                      starValue <= Math.floor(userData?.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {userData?.rating % 1 !== 0 && Math.ceil(userData?.rating) === starValue && (
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
            <span className="ml-2 text-gray-300">{userData?.rating?.toFixed(1)}</span>
          </div>
          <p className="text-gray-300">{userData.designation}</p>
          <p className="text-gray-300">{userData.bio}</p>
          <p className="text-gray-300">{userData.location?.state}</p>
        </div>
        <button 
          onClick={toggleEdit}

          className={`ml-4 bg-blue-400 text-lg py-1 px-5 rounded-lg hover:bg-blue-500 font-semibold transition duration-200 ${currentUserData._id === userData._id ? "block" : "hidden"}`}
        >
          Edit
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 border-b pb-10 border-gray-700">
          <EditableComponent
            isEditing={isEditing}
            value={userData.name || ""}
            onChange={(value) => handleFieldChange('name', value)}
            label="Name"
            placeholder="Enter your name"
            onClick={toggleEdit}
            isUser = {currentUserData._id === userData._id ? true : false}
          />
          <EditableComponent
            isEditing={isEditing}
            value={userData.email || ""}
            onChange={(value) => handleFieldChange('email', value)}
            label="Email address"
            placeholder="Enter your email"
            onClick={toggleEdit}
            isUser = {currentUserData._id === userData._id ? true : false}
            
          />
          <EditableComponent
            isEditing={isEditing}
            value={userData.number || ""}
            onChange={(value) => handleFieldChange('number', value)}
            label="Phone"
            placeholder="Enter your phone number"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

          />
          <div className={`${userData?.role === "worker" ? "block" : "hidden"}`}>
          <EditableComponent
            isEditing={isEditing}
            value={userData.bio || ""}
            onChange={(value) => handleFieldChange('bio', value)}
            label="Bio"
            as="textarea"
            placeholder="Tell us about yourself"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

          />
          </div>
        </div>
        
        <div className="mt-4 border-b border-gray-700 pb-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-white">Address</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <EditableComponent
              isEditing={isEditing}
              value={userData.location?.country || 'India'}
              onChange={(value) => handleFieldChange('location', { ...userData.location, country: value })}
              label="Country"
              placeholder="Enter your country"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

            />
            <EditableComponent
              isEditing={isEditing}
              value={userData.location?.state || ''}
              onChange={(value) => handleFieldChange('location', { ...userData.location, state: value })}
              label="City/State"
              placeholder="Enter your city or state"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

            />
            <EditableComponent
              isEditing={isEditing}
              value={userData.location?.pincode || ''}
              onChange={(value) => handleFieldChange('location', { ...userData.location, pincode: value })}
              label="Postal Code"
              placeholder="Enter your postal code"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

            />
          </div>
        </div>

          { userData?.role === "worker" && (
          <>
        <div className={`mt-4 border-b border-gray-700 pb-8`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-white">Experience</h3>
          </div>
          <div className="m-4">
            <EditableComponent
              isEditing={isEditing}
              value={userData?.experience || ''}
              onChange={(value) => handleFieldChange('experience', value)}
              label="Experience"
              as="textarea"
              placeholder="Describe your work experience"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
          </div>
          <div className="m-4">
            <EditableComponent
              isEditing={isEditing}
              value={userData.skill || ''}
              onChange={(value) => handleFieldChange('skill', value)}
              label="Skills"
              placeholder="List your skills (comma-separated)"
            isUser = {currentUserData._id === userData._id ? true : false}
            onClick={toggleEdit}

            />
          </div>
        </div>
        </>
          )}

        {isEditing && (
          <div className="mt-4">
            <button 
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              <FaSave className="inline mr-2" /> Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;