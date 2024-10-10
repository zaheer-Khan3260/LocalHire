import React, { useEffect, useState } from "react";
import WorkCard from "../helper/WorkCard";
import useFetchCurrentUserData from "../../hooks/useFetchCurrentUserData";
import { Link } from "react-router-dom";
import { customServerApi } from "../../utils/api.js";

// Create a reusable WorkColumn component for better maintainability
const WorkColumn = ({ title, workCards, bgColor, borderColor, emptyMessage, onJobStatusUpdate, isLoading }) => (
  <div className="w-[28rem] h-auto flex flex-col items-center">
    <div className={`px-24 py-3 my-5 text-center ${bgColor} border-2 ${borderColor} rounded-2xl font-semibold`}>
      {title}
    </div>
    <div className="max-h-[41.5rem] overflow-y-auto scrollbar-hidden w-full">
      <div className="flex flex-col gap-3 mx-3 p-4">
        {isLoading ? (
          // Show loading skeletons if loading
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 h-24 rounded-lg shadow-md"></div>
          ))
        ) : workCards.length > 0 ? (
          workCards.map((card, index) => (
            <WorkCard key={index} data={card} onJobStatusUpdate={onJobStatusUpdate} />
          ))
        ) : (
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        )}
      </div>
    </div>
  </div>
);

// Main component using the reusable WorkColumn component
const WorkerDashboard = () => {
  const [waitingForApproval, setWaitingForApproval] = useState([]);
  const [inProgressWork, setInPrograss] = useState([]);
  const [completedWork, setCompletedWork] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const userData = useFetchCurrentUserData();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
      const response = await customServerApi.get(`/job/fetchjobsByWorkerId/${userData?.id}`);
      
      if (response && response.status === 200) {
        console.log("response: ", response.data.data);
        const data = response.data.data;
        setData(data);
        setIsLoading(false); // Set loading to false when fetching ends
      }
    };

    if (userData) {
      fetchJobs();
    }
  }, [userData]);

  useEffect(() => {
    data.forEach(job => {
      const jobExists = (job, column) => column.some(existingJob => existingJob._id === job._id);

      if (!jobExists(job, waitingForApproval) && !jobExists(job, inProgressWork) && !jobExists(job, completedWork)) {
        if (job.status === "Waiting For Approval") {
          setWaitingForApproval((prev) => [job, ...prev]);
        } else if (job.status === "In Progress") {
          setInPrograss((prev) => [job, ...prev]);
        } else if (job.status === "Completed") {
          setCompletedWork((prev) => [job, ...prev]);
        }
      }
    });
  }, [data]);

  // Callback function to handle job status update
  const handleJobStatusUpdate = (updatedJob) => {
    setIsLoading(true)
    // Update the relevant state based on the updated job
    setWaitingForApproval((prev) => prev.filter(job => job._id !== updatedJob._id));
    setInPrograss((prev) => prev.filter(job => job._id !== updatedJob._id)); // Remove from In Progress if it exists

    if (updatedJob.status === "Completed") {
      setCompletedWork((prev) => [updatedJob, ...prev]); // Add to Completed
      setIsLoading(false) 
    } else {
      setInPrograss((prev) => [updatedJob, ...prev]); // Add to In Progress if not completed
      setIsLoading(false)
    }
  };

  const isWorkAvailable = waitingForApproval.length > 0 || completedWork.length > 0 || inProgressWork.length > 0;

  return (
    <div className={`border-2 w-full border-gray-500 h-[calc(100vh - 8rem)] p-2 rounded-xl flex
     ${!isWorkAvailable ? "justify-center items-center" : "justify-start"} gap-2 mt-9 ml-3`}>
      
      {isWorkAvailable ? (
        <div className="flex justify-between">
          <WorkColumn
            title="Waiting For Approval"
            workCards={waitingForApproval}
            bgColor="bg-red-500"
            borderColor="border-red-500"
            emptyMessage="No work in To Do"
            onJobStatusUpdate={handleJobStatusUpdate} // Pass the callback function here
            isLoading={isLoading} // Pass loading state
          />

          <WorkColumn
            title="In Progress"
            workCards={inProgressWork}
            bgColor="bg-yellow-500"
            borderColor="border-yellow-500"
            emptyMessage="No work in Progress"
            onJobStatusUpdate={handleJobStatusUpdate} // Pass the callback function here
            isLoading={isLoading} // Pass loading state
          />

          <WorkColumn
            title="Completed / Paid"
            workCards={completedWork}
            bgColor="bg-green-500"
            borderColor="border-green-500"
            emptyMessage="No work in Completed"
            onJobStatusUpdate={handleJobStatusUpdate} // Pass the callback function here
            isLoading={isLoading} // Pass loading state
          />
        </div>
      ) : (
        <div className="shadow-lg rounded-2xl w-full h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-500 font-semibold mb-2 text-2xl">Hello Mr. {userData?.name}</p>
          <p className="text-gray-600 mb-4 text-2xl">You haven't completed any work yet.</p>
          <p className="text-gray-600 mb-4">Complete your profile to get more jobs.</p>
          <Link to={"/profile"}>
            <p className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition duration-200">
              Complete Profile
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;