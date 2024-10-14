import React, { useEffect, useState } from 'react'
import WorkerCard from '../helper/WorkerCard.jsx'
import { api } from '../../utils/api.js'
import JobForm from '../helper/JobForm.jsx'
import MessageForm from '../helper/MessageForm.jsx'

function UserDashboard() {
  const [workers, setWorkers] = useState([])
  const [jobFormActive, setJobFormActive] = useState(false)
  const [clickedUserData, setClickedUserData] = useState()
  const [messageFormActive, setMessageFormActive] = useState(false)
  const [messageClickedUserData, setMessageClickedUserData] = useState()

  // Function to handle click event
  const handleClick = (_id,name, designation, profileImage) => {
    setClickedUserData({
      _id,
      name,
      designation,
      profileImage
    })
  };

  const handleMessageClick = (_id, name, designation, profileImage) => {
    setMessageClickedUserData({
      _id,
      name,
      designation,
      profileImage
    })
  }



  useEffect(() => {
    if(clickedUserData?.name){
      setJobFormActive(true)
    }
  },[clickedUserData, setClickedUserData])
  useEffect(() => {
    if(messageClickedUserData?.name){
      setMessageFormActive(true)
    }
  },[messageClickedUserData, setMessageClickedUserData])



  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await api.get(`/api/user`, {
          params: {
            limit: 12,
            offset: 0,
            role: "worker"
          }
        });
        setWorkers(response.data.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, []);

console.log("clicker user data : ", clickedUserData)
  return (
    <div className='w-full h-[calc(100vh-4.5rem)] px-4 pt-9'>
      <div className={`w-[89rem] z-50 absolute bottom-0 right-0 h-[52rem] bg-primaryCardColor backdrop-blur-lg
         justify-center items-center ${jobFormActive ? "flex" : "hidden"}`}>
          <JobForm 
          {...clickedUserData} 
          onClick= {() => setJobFormActive(false)}
          />
      </div>
      <div className={`w-[89rem] z-50 absolute bottom-0 right-0 h-[52rem] bg-primaryCardColor backdrop-blur-lg
         justify-center items-center ${messageFormActive ? "flex" : "hidden"}`}>
         <MessageForm
         {...messageClickedUserData} 
         onClick= {() => setMessageFormActive(false)}
         />
      </div>
      <div className='w-full h-full pb-5 overflow-y-auto rounded-2xl flex flex-wrap gap-5 scrollbar-hidden'>
        {
          workers.filter((worker) => worker.role === 'worker').map((worker) => (
            <WorkerCard
              key={worker._id} 
              {...worker} 
              onClick={() => handleClick(worker._id,worker?.name, worker?.designation, worker?.profileImage)}
              handleMessageClick={() => handleMessageClick(worker._id,worker?.name, worker?.designation, worker?.profileImage)}
            />
          ))
        }
      </div>
    </div>
  );
}

export default UserDashboard;
