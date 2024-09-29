import React, { useEffect } from 'react'
import WorkerCard from '../helper/WorkerCard'



function Dashboard() {

  return (
    <div className='w-full h-[calc(100vh-50px)] px-4 py-9 ' >
      <div className='w-full h-full border-2 overflow-auto border-red-500 rounded-2xl flex flex-wrap gap-5 scroll-smooth'>
        <WorkerCard/>
        <WorkerCard/>
        <WorkerCard/>
        <WorkerCard/>
        <WorkerCard/>
        <WorkerCard/>
      </div>
    </div>
  )
}

export default Dashboard
