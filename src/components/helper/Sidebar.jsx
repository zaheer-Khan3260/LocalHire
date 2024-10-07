import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaBriefcase, FaEnvelope, FaCog } from 'react-icons/fa';
import { MdOutlineChevronRight } from "react-icons/md";
import defaultProfileImage from "../../Icons/profile.jpeg"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import { remove } from '../../store/ConversationSlice';

export const analyzeProfileProgress = (profileData) => {
  let progress = 0;
  if(profileData.bio){
    progress += 7;
  }
  if(profileData.skills){
    progress += 7;
  }
  if(profileData.experience){
    progress += 7;
  }
  if(profileData.number){
    progress += 7;
  }
  if(profileData.designation){
    progress += 7;
  }
  if(profileData.availability){
    progress += 7;
  }
  if(profileData.languages){
    progress += 5;
  }
  if(profileData.price){
    progress += 8;
  }

  return progress;
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const [progressBar, setProgressBar] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndLogout = () => {
      const currentDate = new Date();
      const storedDate = localStorage.getItem('lastLoginDate');

      if (storedDate) {
        const storedDateTime = new Date(storedDate);
        
        // Check if more than 24 hours have passed
        if (currentDate - storedDateTime > 24 * 60 * 60 * 1000) {
          // If more than 24 hours have passed, logout
          dispatch(logout());
          // You might want to redirect the user to the login page here
          navigate('/login');
        }
      }

      // Update the stored date
      localStorage.setItem('lastLoginDate', currentDate.toISOString());
    };

    // Initial check
    checkSessionAndLogout();

    // Set up interval to run every hour
    const intervalId = setInterval(checkSessionAndLogout, 3600000); // 3600000 ms = 1 hour

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch, navigate]);

  const fetchUserProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/api/profile/${userData?.profile}`);
      if(response.data){
        setProfileData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  if(userData?.profile){
    fetchUserProfileData();
  }

  const progressBarValue = useMemo(() => {
    if (profileData) {
      return analyzeProfileProgress(profileData) + 45;
    }
    return 45; 
  }, [profileData]);

  useEffect(() => {
    setProgressBar(progressBarValue);
  }, [progressBarValue]);


  const handleLogout = () => {
    dispatch(logout());
    dispatch(remove());
    navigate('/login');
  };

  return (
    <div className="bg-[rgba(14,20,33,0.7)] text-white  rounded-2xl h-full w-[20rem] px-4 pt-10">

      {
        userData && (
          <>
          <div className='mb-5 h-auto'>
          <div className='w-full h-full'>
            <img src={defaultProfileImage} alt="logo" className='w-28 h-28 rounded-full object-fill' />
          </div>

          <div className='my-6 border-b-2 border-gray-700 pb-8'>
            <div className='text-xl font-semibold flex items-center'>
              <h2 className='mr-2'>{userData.name}</h2>
              {
                userData.is_verified && (
                  <div className='text-green-500'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m9 12 2 2 4-4"/>
                  </svg>
                  </div>
                )

              }
            </div>
            <p className='text-gray-400'>{userData?.designation}</p>
          </div>
          { progressBar < 100 && userData?.role === "worker" && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Link to="/profile">
              <span className="text-sm flex cursor-pointer">Profile Completion <MdOutlineChevronRight className='text-xl mt-[1.5px]' /></span>
              </Link>
              <span className="text-sm font-semibold">{progressBar}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${progressBar}%`}}
              ></div>
            </div>
          </div>
          )
          }
        </div>
        

      <nav>
        <ul className="space-y-2">
          <li onClick={() => dispatch(remove())}>
            <Link to="/" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105
            transition-all duration-400 rounded-xl">
              <FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105
            transition-all duration-400 rounded-xl">
              <FaUser />
              <span>Profile</span>
            </Link>
          </li>
          {
            userData?.role === "worker" && (
              <li>
            <Link to="/jobs" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105
            transition-all duration-400 rounded-xl">
              <FaBriefcase />
              <span>Jobs</span>
                </Link>
              </li>
            )
          }
          <li>
            <Link to="/messages" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105
            transition-all duration-400 rounded-xl">
              <FaEnvelope />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105
            transition-all duration-400 rounded-xl">
              <FaCog />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105
            transition-all duration-400 rounded-xl">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
    </>
    )
}
      {
        !userData && (
        <div className="mb-10 p-4 h-full flex flex-col">
          <div className="text-center">
              <p className="mb-3 text-gray-300">Sign in to access all features</p>
              <div className="">
                  <div className="w-full mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                    <Link to="/login">
                      Login
                    </Link>
                   </div>
                  <div className="w-full mb-5 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300">
                    <Link to="/signup" >
                      Sign Up
                    </Link>
                  </div>
              </div>
          </div> 
       </div>
       )
      }
    </div>
  
  );
};

export default Sidebar;


