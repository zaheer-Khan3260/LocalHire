import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import useFetchCurrentUserData from '../../hooks/useFetchCurrentUserData.js';
import InputComponent from '../helper/Input.jsx';
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

    if (currentUserData.id !== _id) {
      fetchUserData(_id);
    } else {
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
    console.log("updated userData: ", userData)
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="w-full mx-auto p-6 rounded-lg shadow-lg transition-transform transform mt-8 ml-4 px-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">My Profile</h1>
      
      <div className="flex items-center mb-6 border-b pb-4 border-gray-700">
        <img src={userData.profileImage || "/api/placeholder/100/100"} alt="Profile" className="w-24 h-24 rounded-full border-2 border-blue-500 mr-4 shadow-md" />
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-white">{userData.name}</h2>
          <p className="text-gray-300">{userData.bio}</p>
          <p className="text-gray-300">{userData.location?.state}</p>
        </div>
        <button onClick={toggleEdit} className="ml-4 text-blue-400 hover:text-blue-300 transition duration-200">
          <FaEdit size={24} /> 
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <EditableComponent
            isEditing={isEditing}
            value={userData.name}
            onChange={(value) => handleFieldChange('name', value)}
            label="Name"
          />
          <EditableComponent
            isEditing={isEditing}
            value={userData.email}
            onChange={(value) => handleFieldChange('email', value)}
            label="Email address"
          />
          <EditableComponent
            isEditing={isEditing}
            value={userData.number}
            onChange={(value) => handleFieldChange('number', value)}
            label="Phone"
          />
          <EditableComponent
            isEditing={isEditing}
            value={userData.bio || ''}
            onChange={(value) => handleFieldChange('bio', value)}
            label="Bio"
            as="textarea"
          />
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Address</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <EditableComponent
              isEditing={isEditing}
              value={userData.location?.country || ''}
              onChange={(value) => handleFieldChange('location', { ...userData.location, country: value })}
              label="Country"
            />
            <EditableComponent
              isEditing={isEditing}
              value={userData.location?.state || ''}
              onChange={(value) => handleFieldChange('location', { ...userData.location, state: value })}
              label="City/State"
            />
            <EditableComponent
              isEditing={isEditing}
              value={userData.location?.pincode || ''}
              onChange={(value) => handleFieldChange('location', { ...userData.location, pincode: value })}
              label="Postal Code"
            />
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