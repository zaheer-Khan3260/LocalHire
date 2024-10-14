import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaEnvelope, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineChevronRight } from "react-icons/md";
import defaultProfileImage from "../../Icons/profile.jpeg";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { remove } from '../../store/ConversationSlice';
import { GrUserWorker } from "react-icons/gr";
import NotificationCard from './NotificationCard';
import { useSocketContext } from '../../utils/socketContext';
import {customServerApi} from '../../utils/api.js'

// Moved outside component to prevent unnecessary re-creation
const analyzeProfileProgress = (profileData) => {
  let progress = 0;
  const fields = ['name','email', 'profileImage', 'role', 'verified', 'bio', 'skill', 'experience', 'number', 'designation', 'isAvailable'];
  const fieldWeights = 9;
  
  fields.forEach((field) => {
    if (profileData?.[field]) {
      progress += fieldWeights;
    }
  });

  return progress;
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const [unseenCount, setUnseenCount] = useState(0);

  const progressBarValue = useMemo(() => {
    return userData ? analyzeProfileProgress(userData) : 0;
  }, [userData]);



  useEffect(() => {
    const checkSessionAndLogout = () => {
      const currentDate = new Date();
      const storedDate = localStorage.getItem('lastLoginDate');

      if (storedDate) {
        const storedDateTime = new Date(storedDate);
        
        if (currentDate - storedDateTime > 24 * 60 * 60 * 1000) {
          dispatch(logout());
          navigate('/login');
        }
      }

      localStorage.setItem('lastLoginDate', currentDate.toISOString());
    };
    
    checkSessionAndLogout();
    const intervalId = setInterval(checkSessionAndLogout, 3600000);
    return () => clearInterval(intervalId);
  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!userData?._id) return;
      try {
        const response = await customServerApi.get(`/job/getNotification/${userData._id}`);
        if (response.data) {
          const responseData = response.data.data;
          setNotificationData(prevNotifications => {
            const newNotifications = responseData.filter(
              data => !prevNotifications.some(notification => notification._id === data._id)
            );
            setUnseenCount(newNotifications.length);
            return [...prevNotifications, ...newNotifications];
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotification();
  }, [userData]);

  const updateSeenStatus = () => {
    setNotificationData(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, seen: true }))
    );
    setUnseenCount(0);
  }

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification) => {
      setNotificationData(prevNotifications => {
        if (!prevNotifications.some(notification => notification._id === newNotification._id)) {
          setUnseenCount(prevCount => prevCount + 1);
          return [...prevNotifications, newNotification];
        }
        return prevNotifications;
      });
    };

    socket.on("notification", handleNewNotification);
    console.log("capture notification event");
    setUnseenCount(prev => prev + 1);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket]);


  const handleLogout = () => {
    dispatch(logout());
    dispatch(remove());
    navigate('/login');
  };

  return (
    <div className="bg-primaryCardColor text-white rounded-2xl h-full w-[20rem] relative px-4 pt-10">
      <div className={`transition-all duration-500 bg-primaryCardColor h-full px-3 absolute top-0 left-0 z-50 border-2 rounded-xl ${isNotificationActive ? "w-full opacity-100" : "w-0 opacity-0"}`}>
        <div className='w-full flex justify-between cursor-pointer pr-1 pt-2' onClick={() => setIsNotificationActive(false)}>
          <h2 className='pl-1 text-2xl'>Notification</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className='pt-1 w-8 h-8'
            aria-label="Close notifications"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>

        <div className='mt-10'>
          {notificationData.map((data) => (
            <NotificationCard
              key={data._id}
              handleClick={() => {
                setIsNotificationActive(false);
                window.location.reload();
              }}
              data={data}
            />
          ))}
        </div>
      </div>
      
      {userData && (
        <div className={`${isNotificationActive ? "opacity-0" : "opacity-100"}`}>
          <div className='mb-5 h-auto'>
            <div className='w-full h-full'>
              <img src={userData.profileImage || defaultProfileImage} alt={`${userData.name}'s profile`} className='w-28 h-28 rounded-full object-fill' />
            </div>

            <div className='my-6 border-b-2 border-gray-700 pb-8'>
              <div className='text-xl font-semibold flex items-center'>
                <h2 className='mr-2'>{userData.name}</h2>
                <div className={`${userData?.verified ? "text-green-500" : "text-gray-500"} relative group cursor-pointer`}>
                    <div className={`border group-hover:opacity-100 opacity-0  px-2 py-1 text-sm transition-all duration-700
                    rounded-xl absolute top-[-35px] left-0 ${userData?.verified ? "w-fit" : "w-24"}`}>{userData?.verified ? "Verified" : "Not Verified"}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Verified user">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
              </div>
              <p className='text-gray-400'>{userData?.designation}</p>
            </div>
            
            {progressBarValue < 100 && userData?.role === "worker" && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <Link to={`/profile/${userData?._id}`}>
                    <span className="text-sm flex cursor-pointer">Profile Completion <MdOutlineChevronRight className='text-xl mt-[1.5px]' /></span>
                  </Link>
                  <span className="text-sm font-semibold">{progressBarValue}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{width: `${progressBarValue}%`}}
                    role="progressbar"
                    aria-valuenow={progressBarValue}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            ) }
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105 transition-all duration-400 rounded-xl" onClick={() => dispatch(remove())}>
                  <FaHome aria-hidden="true" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to={`/profile/${userData._id}`} className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105 transition-all duration-400 rounded-xl">
                  <FaUser aria-hidden="true" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/messages" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105 transition-all duration-400 rounded-xl">
                  <FaEnvelope aria-hidden="true" />
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                {userData?.role === "user" && (
                  <Link to="/post-job" className="flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105 transition-all duration-400 rounded-xl">
                    <GrUserWorker aria-hidden="true" />
                    <span>Workers</span>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    updateSeenStatus();
                    setIsNotificationActive(true);
                  }} 
                  className="w-full flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105 transition-all duration-400 rounded-xl relative"
                  aria-label={`Notifications ${unseenCount > 0 ? `(${unseenCount} unseen)` : ''}`}
                >
                  <FaBell aria-hidden="true" />
                  <span>Notification</span>
                  {unseenCount > 0 && (
                    <span className="absolute top-0 text-center font-semibold left-28 ml-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unseenCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </nav>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 hover:bg-blue-500 hover:scale-105 transition-all duration-400 rounded-xl mt-4">
            <FaSignOutAlt aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      )}
      {!userData && (
        <div className="mb-10 p-4 h-full flex flex-col">
          <div className="text-center">
            <p className="mb-3 text-gray-300">Sign in to access all features</p>
            <div className="">
              <Link to="/login" className="block w-full mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                Login
              </Link>
              <Link to="/signup" className="block w-full mb-5 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300">
                Sign Up
              </Link>
            </div>
          </div> 
        </div>
      )}
    </div>
  );
};

export default Sidebar;