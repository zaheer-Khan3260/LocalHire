import React from 'react'
import defaultImage from "../../Icons/profile.jpeg";

function WorkCard(data) {
  return (
    <div className='border-2 bg-[rgba(14,20,33,0.7)] border-[rgba(14,20,33,0.7)] shadow-xl transition-all duration-500 hover:scale-105 w-[25rem] rounded-xl p-3'>
      {/* Image and name container */}
      <div className='w-full border-green-600 borde-2 h-20 flex gap-2'> 
        <div className='w-20 h-20 rounded-full'>
          <img src={defaultImage} alt="" className='w-20 h-20 rounded-full' />
        </div>
        <div className='mt-1 ml-4'>
          <h2 className='text-xl font-semibold'>{data?.name}</h2>
          <p className='text-sm text-gray-600'>{data?.number}</p>
          <p className='text-sm text-gray-600'>{data?.email}</p>
        </div>
      </div>
      {/* others detail container */}

      <div className=' w-full mt-5 p-2 flex justify-between items-center gap-4 '>
        <div className='w-[70%] flex justify-center gap-3 text-center'>
        <div className='border-gray-500 border-2 w-full px-4 py-1 rounded-2xl '>$ {data?.price}</div>
        <div className={` w-full px-4 py-1 rounded-2xl ${
          data?.status === "Todo" ? "bg-red-500" :
          data?.status === "In Progress" ? "bg-yellow-500" : "bg-green-500"
        }`}>{data?.status}</div>

        </div>
        <div className='w-[30%] bg-blue-500 hover:bg-blue-700 duration-300 transition-all rounded-2xl px-3 py-2 text-center'>
          <h4>View Job</h4>
        </div>
      </div>
      
    </div>
  )
}

export default WorkCard
