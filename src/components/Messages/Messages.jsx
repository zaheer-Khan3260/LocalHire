import React, {useState, useEffect} from 'react'
import ConversationUser from '../helper/ConversationUser.jsx'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import { customServerApi } from '../../utils/api.js'

function Messages() {
  const [conversationUser, setConversationUser] = useState([])
  const selectedConversationId = useSelector(state => state.conversation.id);
  const conversationStatus = useSelector(state => state.conversation.status);
  const user = useSelector(state => state.auth.userData)

  useEffect(() => {
    console.log("user: ",user)
    const fetchUsers = async () => {
      const response = await customServerApi.post(`/message/getConversation`, {senderId: user.id});
      if(response) {
        console.log("conversation response: ",response.data.data)
        setConversationUser(response.data.data);
      }
    }

    fetchUsers();
  }, []);
  return (
    <div className=' w-full flex'>
        <div className='border-r-2 rounded-lg ml-8 border-gray-500 w-[30%] h-[calc(100vh-5rem)]'>
            <ConversationUser
            user={conversationUser}
            />
        </div>
        <div className=' w-[70%] h-[calc(100vh-5rem)] overflow-auto scrollbar-hidden scroll-smooth'>
          {
            conversationStatus === true ? (
              <Outlet/>
            ) : (
              <NoChatSelected/>
            )
          }
            
        </div>
    </div>
  )
}

const NoChatSelected = () => {
  return (
  <div className="flex flex-col items-center justify-center h-full text-center bg-[rgba(14,20,33,0.9)] text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
      <p className="text-lg mb-4">Ready to start chatting?</p>
      <p className="text-gray-400">Choose a person from the list to begin your conversation.</p>
    </div>
  )
}

export default Messages
