import React, { useState } from 'react'
import defaultImage from "../../Icons/profile.jpeg"
import useFetchCurrentUserData from '../../hooks/useFetchCurrentUserData';
import { useNavigate } from 'react-router';
import { customServerApi } from '../../utils/api';
function MessageForm({
    _id,
    name,
    profileImage,
    designation,
    onClick
}) {

    const [message, setMessage] = useState("");
    const userData = useFetchCurrentUserData();
    const navigate = useNavigate()

    const sendMessage = async() => {
        const response = await customServerApi.post("/message/sendMessage", {
            senderId: userData?._id,
            recieverId: _id,
            message: message
          })
          if(response) {
            console.log("response: ", response)
            document.querySelector('.closeButton').click();
            navigate("/messages")
            setMessage("");
          }
    }
  return (
    <div className="border-2 rounded-lg border-primaryCardColor w-[30rem] bg-primaryCardColor p-4">
      <div
        className="closeButton cursor-pointer w-full flex justify-end"
        onClick={onClick}
      >
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
          class="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>
      <div className="flex items-center gap-5">
        <div className="w-28 h-28 rounded-full">
          <img
            src={profileImage ? profileImage : defaultImage}
            alt=""
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-2xl font-semibold">{name}</h4>
          <p className="text-gray-400 mt-1">{designation ? designation : null}</p>
        </div>
      </div>
    <div className='mt-5'>
    <label className="block text-md font-medium text-gray-500 mb-3">
          Message:
        </label>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message...."
          rows="5"
          className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor"
        />
        <div id="word-count" className="text-right text-gray-400 mt-1">
          {message.length}/150
        </div>

        <div className="mt-4 w-full text-right">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => sendMessage(message)}
          >
            Send Message
          </button>
        </div>

    </div>

      
    </div>
  )
}

export default MessageForm
