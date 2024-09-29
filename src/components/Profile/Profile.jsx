import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaSave } from 'react-icons/fa';
import InputComponent from '../helper/Input.jsx'; // Adjust the import path as necessary

const Profile = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 234 567 8900',
    bio: 'Software Engineer with 5 years of experience',
    country: 'United States',
    cityState: 'New York, NY',
    postalCode: '10001',
    taxId: 'ABC1234567',
  });

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      Object.keys(profileData).forEach((key) => {
        setValue(key, profileData[key]);
      });
    }
  };

  const onSubmit = (data) => {
    console.log("Updated Profile Data:", data);
    setProfileData(data);
    setIsEditing(false); 
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg transition-transform transform mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">My Profile</h1>
      
      <div className="flex items-center mb-6 border-b pb-4 border-gray-700">
        <img src="/api/placeholder/100/100" alt="Profile" className="w-24 h-24 rounded-full border-2 border-blue-500 mr-4 shadow-md" />
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-white">{profileData.firstName} {profileData.lastName}</h2>
          <p className="text-gray-300">{profileData.bio}</p>
          <p className="text-gray-300">{profileData.cityState}</p>
        </div>
        <button onClick={toggleEdit} className="ml-4 text-blue-400 hover:text-blue-300 transition duration-200">
          <FaEdit size={24} /> 
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="text-gray-200">First Name</p>
            {isEditing ? (
              <InputComponent
                type="text"
                name="firstName"
                placeholder="Enter first name"
                ref={register}
                className="bg-gray-600 text-gray-200"
              />
            ) : (
              <p className="font-medium text-gray-100">{profileData.firstName}</p>
            )}
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="text-gray-200">Last Name</p>
            {isEditing ? (
              <InputComponent
                type="text"
                name="lastName"
                placeholder="Enter last name"
                ref={register}
                className="bg-gray-600 text-gray-200"
              />
            ) : (
              <p className="font-medium text-gray-100">{profileData.lastName}</p>
            )}
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="text-gray-200">Email address</p>
            {isEditing ? (
              <InputComponent
                type="email"
                name="email"
                placeholder="Enter email"
                ref={register}
                className="bg-gray-600 text-gray-200"
              />
            ) : (
              <p className="font-medium text-gray-100">{profileData.email}</p>
            )}
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="text-gray-200">Phone</p>
            {isEditing ? (
              <InputComponent
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                ref={register}
                className="bg-gray-600 text-gray-200"
              />
            ) : (
              <p className="font-medium text-gray-100">{profileData.phone}</p>
            )}
          </div>
          <div className="col-span-2 bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="text-gray-200">Bio</p>
            {isEditing ? (
              <InputComponent
                as="textarea"
                name="bio"
                placeholder="Enter bio"
                ref={register}
                className="bg-gray-600 text-gray-200 w-full"
              />
            ) : (
              <p className="font-medium text-gray-100">{profileData.bio}</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Address</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <p className="text-gray-200">Country</p>
              {isEditing ? (
                <InputComponent
                  type="text"
                  name="country"
                  placeholder="Enter country"
                  ref={register}
                  className="bg-gray-600 text-gray-200"
                />
              ) : (
                <p className="font-medium text-gray-100">{profileData.country}</p>
              )}
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <p className="text-gray-200">City/State</p>
              {isEditing ? (
                <InputComponent
                  type="text"
                  name="cityState"
                  placeholder="Enter city/state"
                  ref={register}
                  className="bg-gray-600 text-gray-200"
                />
              ) : (
                <p className="font-medium text-gray-100">{profileData.cityState}</p>
              )}
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <p className="text-gray-200">Postal Code</p>
              {isEditing ? (
                <InputComponent
                  type="text"
                  name="postalCode"
                  placeholder="Enter postal code"
                  ref={register}
                  className="bg-gray-600 text-gray-200"
                />
              ) : (
                <p className="font-medium text-gray-100">{profileData.postalCode}</p>
              )}
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <p className="text-gray-200">TAX ID</p>
              {isEditing ? (
                <InputComponent
                  type="text"
                  name="taxId"
                  placeholder="Enter tax ID"
                  ref={register}
                  className="bg-gray-600 text-gray-200"
                />
              ) : (
                <p className="font-medium text-gray-100">{profileData.taxId}</p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-4">
            <button 
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              <FaSave className="inline mr-2" /> Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;