import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSocketContext } from '../../utils/socketContext.jsx';
import { add } from '../../store/ConversationSlice.js';
import { useSelector } from 'react-redux';

function ConversationUser({ user }) {
  const [recieverData, setRecieverData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { onlineUser } = useSocketContext();
  console.log("onlineUser: ", onlineUser)
  const userId = useSelector((state) => state.auth.userData.id)

  const handleNavigation = (id) => {
    dispatch(add(id));
    navigate(`${id}`);
  }
  useEffect(() => {
    const fetchUserData = async () => {
      for (const u of user) {
        const receiverId = u?.conversationBetween?.filter((id) => id !== userId ? id : null);
        if (receiverId) {
          try {
            const response = await api.get(`/api/user/${receiverId}`);
            if (response && response.data) {
              const updatedResponse = {
                ...response.data,
                conversationId: u?._id
              }
              setRecieverData(prevData => {
              const newUser = Array.isArray(updatedResponse) ? updatedResponse[0] : updatedResponse;
                const userExists = prevData.some(existingUser => existingUser._id === newUser._id);
                if (!userExists) {
                  return [...prevData, newUser];
                }
                return prevData;
              });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
    };

    fetchUserData();
  }, [user, onlineUser]);

  // console.log("recieverData: ", recieverData)

  return (
    <div className="w-80 mx-auto font-sans pt-4">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="mt-4 h-[calc(100vh-15rem)] overflow-auto scrollbar-hidden">
        {recieverData.map((user, index) => {
          const isOnline = onlineUser.includes(user._id);
          return (
            <div key={index} className="flex items-center py-4 border-b border-gray-200 cursor-pointer" onClick={() => handleNavigation(user.conversationId)}>
              <div className="mr-4 relative">
                <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg text-blue-500 ${isOnline ? 'border-2 border-green-500' : ''}`}>
                  {user.name.charAt(0)}
                </div>
                {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1">
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-gray-500">{user.designation}</div>
                  <div className="text-gray-500 text-sm">{user.message}</div>
                </div>
              </div>
              {user.unread > 0 && <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{user.unread}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConversationUser;
