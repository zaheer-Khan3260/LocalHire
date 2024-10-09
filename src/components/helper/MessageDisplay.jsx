import React, { useEffect, useState, useRef } from "react";
import Input from "./Input.jsx"
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { remove } from "../../store/ConversationSlice.js";
import { api, customServerApi } from "../../utils/api.js";
import { useSelector } from "react-redux";
import {useSocketContext} from "../../utils/socketContext.jsx"
import { MdDeleteOutline } from "react-icons/md";



function MessageDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([])
  const[reciever, setReciever] = useState(null)
  const [inputMessage, setInputMessage] = useState("")
  const [recieverData, setRecieverData] = useState(null)
  const {socket} = useSocketContext()
  const lastMessageRef = useRef(null);

  const userData = useSelector((state) => state.auth.userData)
  const id = useParams()


  const sendMessage = async () => {
    const response = await customServerApi.post("/message/sendMessage", {
      senderId: userData.id,
      recieverId: reciever,
      message: inputMessage
    })
    if(response) {
      setMessages([...messages, response.data.data])
      setInputMessage("");
    }
  } 

  const deleteMessage = async (messageId) => {
    try {
      const response = await customServerApi.post("/message/deleteMessage", {
        messageId,
        conversationId: id.id,
        senderId: userData.id,
        receiverId: reciever
      });
      if (response.status === 200) {
        // The message will be removed from the state when the socket event is received
        console.log("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  useEffect(() => {

    const fetchConversation = async () => {
      const response = await customServerApi.post(`/message/getConversationById`, {conversationId: id.id})
      if(response) {
        setMessages(response.data.data.messages)
        if(response.data.data.conversationBetween.length === 2) {
          setReciever(response.data.data.conversationBetween.find((user) => user !== userData.id))
        }
      }
    }
   
    const fetchRecieverData = async () => {
      const response = await api.get(`/api/user/${reciever}`)
      if(response) {
        setRecieverData(response.data)
      }
    }


    if(id.id) {
      fetchConversation()
    }
    if(reciever) {
      fetchRecieverData()
    }
  }, [reciever])
 

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket?.on("messageDeleted", ({ messageId, conversationId }) => {
      if (conversationId === id.id) {
        setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));
      }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messageDeleted");
    };
  }, [socket, id.id]);

  useEffect(() => {
    if (lastMessageRef.current) {
      const lastMessageElement = lastMessageRef.current;
      const container = lastMessageElement.parentElement;

      const isInView = (element) => {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        return (
          elementRect.top >= containerRect.top &&
          elementRect.left >= containerRect.left &&
          elementRect.bottom <= containerRect.bottom &&
          elementRect.right <= containerRect.right
        );
      };

      if (!isInView(lastMessageElement)) {
        lastMessageElement.scrollIntoView({ behavior: 'instant' });
      }
    }
  }, [messages, socket]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-[rgba(14,20,33)] bg-opacity-100 shadow-sm p-4 flex justify-between items-center sticky top-0 overflow-hidden">  
        <div className="flex items-center">
          <button onClick={() => {
              dispatch(remove())
              navigate("/messages")
          }} 
          className="text-gray-600 hover:text-gray-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className={`w-10 h-10 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-lg text-blue-500`}>
                {recieverData?.name.charAt(0)}
              </div>
          <div>
            <h1 className="font-bold text-lg">{recieverData?.name}</h1>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
      {
      messages && messages.length > 0 ? (
        <div className="flex-grow overflow-y-auto p-4 scrollbar-hidden">
        <div className="text-center text-sm text-gray-500 my-2">
          Today, March 12
        </div>
        {
          messages.map((message, index) => (
            message.senderId === userData.id ? (
              <div key={index} className="flex justify-end items-center mb-4 group"
              ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                <div className="max-w-[70%] flex items-center space-x-2">
                <div className="text-xl">
                  <div className="hover:scale-110 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100">
                    <MdDeleteOutline className="text-xl hover:text-red-600 cursor-pointer" onClick={() => deleteMessage(message._id)} />
                  </div>
                </div>
                  <div className="rounded-xl p-3 bg-blue-500 text-white">
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-lg text-blue-500`}>
                {userData.name.charAt(0)}
              </div>
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start items-center mb-4"
              ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                <div className="max-w-[70%] flex space-x-2">
                <div className={`w-10 h-10 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-lg text-blue-500`}>
                {recieverData?.name?.charAt(0)}
              </div>
                  <div className="rounded-2xl p-3 bg-gray-300 text-gray-600">
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              </div>
            )
          ))
        }
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[rgba(14,20,33,0.9)] text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
      <p className="text-lg mb-4">You didn't send message to {recieverData?.name || 'the receiver'}?</p>
      <p className="text-gray-400">Start the conversation.</p>
    </div>
      )
        }
      {/* Messages */}
      <div className="sticky bottom-0 w-full bg-[rgba(14,20,33)] border-gray-700">
        <div className="max-w-4xl mx-auto relative">
          <Input
            placeholder="Type your message..."
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
                setInputMessage("");
              }
            }}
            value={inputMessage}
            className="bg-[rgba(255,255,255,0.1)] text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            buttonClassName="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200"
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-300 transition-colors duration-200 rotate-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      </div>
    </div>    
  )
}

export default MessageDisplay;