import React, { useEffect } from 'react'
import WorkerCard from '../helper/WorkerCard'



function Dashboard() {

  return (
    <div className='w-full h-[calc(100vh-4.5rem)] px-4 pt-9  ' >
      <div className='w-full h-full pt-1 overflow-y-auto rounded-2xl flex flex-wrap gap-5 scrollbar-hidden'>
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
