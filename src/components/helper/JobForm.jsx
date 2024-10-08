import React from 'react'
import { IoMdArrowBack } from "react-icons/io";

import defaultImage from "../../Icons/profile.jpeg"

function JobForm({
  _id,
  name, 
  designation,
  image,
  onClick
}) {
  
  return (
    <div className="border-2 rounded-lg border-primaryCardColor w-[30rem] h-[38rem] bg-primaryCardColor p-4">
      <div className=' cursor-pointer w-full flex justify-end' onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
      </svg>
      </div>
          <div className="flex items-center gap-5">
            <div className="w-28 h-28 rounded-full">
              <img src={image ? image : defaultImage} alt="" className="w-28 h-28 rounded-full" />
            </div>
            <div>
              <h4 className="text-2xl font-semibold">{name}</h4>
              <p className="text-gray-400 mt-1">{designation}</p>
            </div>
          </div>
          <div className="h-auto mt-5 px-2">
            <label className="block text-md font-medium text-gray-500 mb-3">Job Description:</label>
            <textarea 
              placeholder="eg: create a wooden table" 
              rows="3" 
              maxLength="150" 
              className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor"
              onInput={(e) => {
                const wordCount = e.target.value.length;
                document.getElementById('word-count').textContent = `${wordCount}/150`;
              }}
            />
            <div id="word-count" className="text-right text-gray-400 mt-1">0/150</div>
            <div>
              <label className="block text-md font-medium text-gray-500 mb-3">Price:</label>
              <input 
                type="number" 
                placeholder="eg: 2000, 500" 
                className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor"
              />
            </div>
            <div className="mt-2">
              <label className="block text-md font-medium text-gray-500 mb-3">Timing:</label>
              <select className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor">
                <option value="">Select Timing</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>
            <div className="mt-8 w-full text-end">
              <button className="w-28 font-semibold p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Hire
              </button>
            </div>
          </div>
        </div>
  )
}

export default JobForm
