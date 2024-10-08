import React from 'react'
import defaultImage from "../../Icons/profile.jpeg";

function WorkCard(data) {
  return (
    <div className='border-2 bg-[rgba(14,20,33,0.7)] border-[rgba(14,20,33,0.7)] shadow-xl transition-scale duration-300 hover:scale-105 w-[25rem] rounded-xl p-3'>
      {/* Image and name container */}
      <div className='w-full border-slate-600 border-b-2 h-24 flex gap-2  '> 
        <div className='w-20 h-20 rounded-full'>
          <img src={defaultImage} alt="" className='w-20 h-20 rounded-full' />
        </div>
        <div className='mt-1 ml-4'>
          <h2 className='text-xl font-semibold'>{data?.name}</h2>
          <p className='text-sm text-gray-600'>{data?.number}</p>
          <p className='text-sm text-gray-600'>{data?.email}</p>
        </div>
      </div>
      {/* job discription container */}
      <div className='w-full mt-3 text-sm '>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et mollitia impedit saepe fugit quisquam obcaecati minus dolor atque, 
      </div>
      {/* others detail container */}
      <div className=' w-full mt-8 flex justify-between items-center gap-2 cursor-pointer '>
        <div className='w-[70%] flex gap-3 text-center'>
        <div className='h-9 p-2 bg-slate-500 rounded-md '>Price: {data?.price}</div>
        <div className={`h-9 p-2 rounded-md text-sm ${
          data?.status === "Waiting For Approval" ? "bg-red-500" :
          data?.status === "In Progress" ? "bg-yellow-500" : "bg-green-500"
        }`}>{data?.status}</div>

        </div>
        <div className='w-[30%]'>
          <h4 className={`bg-blue-500 hover:bg-blue-700 duration-300 transition-all rounded-md px-1 py-2 text-center ${data.status === "Completed" ? "hidden" : null}`}>{
            data.status === "Waiting For Approval" ? "Accept" : "Done"
            }</h4>
          
        </div>
      </div>
      
    </div>
  )
}

export default WorkCard
