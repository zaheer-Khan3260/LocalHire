import React, { useEffect, useState } from 'react'
import WorkerCard from '../helper/WorkerCard.jsx'
import { api } from '../../utils/api.js'
import defaultImage from "../../Icons/profile.jpeg"
import JobForm from '../helper/JobForm.jsx'

function UserDashboard() {
  const [workers, setWorkers] = useState([])
  const [jobFormActive, setJobFormActive] = useState(false)
  const [clickedUserData, setClickedUserData] = useState()

  // Function to handle click event
  const handleClick = (_id,name, designation, image) => {
    setClickedUserData({
      _id,
      name,
      designation,
      image
    })
  };


  useEffect(() => {
    if(clickedUserData?.name){
      setJobFormActive(true)
    }
  },[clickedUserData, setClickedUserData])
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await api.get(`/api/user`, {
          params: {
            limit: 12,
            offset: 0
          }
        });
        setWorkers(response.data.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className='w-full h-[calc(100vh-4.5rem)] px-4 pt-9'>
      <div className={`w-[89rem] z-50 absolute bottom-0 right-0 h-[52rem] bg-primaryCardColor backdrop-blur-lg
         justify-center items-center ${jobFormActive ? "flex" : "hidden"}`}>
          <JobForm 
          {...clickedUserData} 
          onClick= {() => setJobFormActive(false)}
          />
      </div>
      <div className='w-full h-full pt-1 overflow-y-auto rounded-2xl flex flex-wrap gap-5 scrollbar-hidden'>
        {
          workers.filter((worker) => worker.role === 'worker').map((worker) => (
            <WorkerCard
              key={worker._id} 
              {...worker} 
              onClick={() => handleClick(worker._id,worker?.name, worker?.designation, worker?.image)} // Pass image and name
            />
          ))
        }
      </div>
    </div>
  );
}

export default UserDashboard;
