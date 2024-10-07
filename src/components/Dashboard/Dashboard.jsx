import React, { useEffect, useState } from 'react'
import WorkerCard from '../helper/WorkerCard'
import { api } from '../../utils/api.js'



function Dashboard() {

  const [workers, setWorkers] = useState([])

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await api.get(`/api/user`, {
          params: {
            limit: 12,
            offset: 0
          }
        });
        setWorkers(response.data.data)
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className='w-full h-[calc(100vh-4.5rem)] px-4 pt-9  ' >
      <div className='w-full h-full pt-1 overflow-y-auto rounded-2xl flex flex-wrap gap-5 scrollbar-hidden'>
        {
        workers.filter((worker) => worker.role === 'worker').map((worker) => (
          <WorkerCard key={worker.id} {...worker} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
