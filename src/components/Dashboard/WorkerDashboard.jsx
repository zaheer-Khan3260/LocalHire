import React from "react";
import WorkCard from "../helper/WorkCard";
import useFetchCurrentUserData from "../../hooks/useFetchCurrentUserData";
import { Link } from "react-router-dom";

// Create a reusable WorkColumn component for better maintainability
const WorkColumn = ({ title, workCards, bgColor, borderColor, emptyMessage }) => (
  <div className="w-[28rem] h-auto flex flex-col items-center">
    <div className={`px-24 py-3 my-5 text-center ${bgColor} border-2 ${borderColor} rounded-2xl font-semibold`}>
      {title}
    </div>
    <div className="max-h-[41.5rem] overflow-y-auto scrollbar-hidden w-full">
      <div className="flex flex-col gap-3 mx-3 p-4">
        {workCards.length > 0 ? (
          workCards.map((card, index) => <WorkCard key={index} {...card}  />)
        ) : (
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        )}
      </div>
    </div>
  </div>
);

// Main component using the reusable WorkColumn component
const WorkerDashboard = () => {
  const waitingForApproval = [
  
  ];
  const inProgressWork = [
    
  ]; 
  const completedWork = [
    {
      name: "Zaheer khan",
      number: 8076904348,
      email: "zaheer@gmail.com",
      price: 1599,
      status: "Completed"
     }
  ];
  const userData = useFetchCurrentUserData()


  const isWorkAvailable = waitingForApproval.length > 0 || completedWork.length > 0 || inProgressWork.length > 0 ? true : false;

  return (
    <div className={`border-2 w-full border-gray-500 h-[calc(100vh - 8rem)] p-2 rounded-xl flex
     ${!isWorkAvailable ? "justify-center items-center" : "justify-start"} gap-2 mt-9 ml-3`}>
      
      {
        isWorkAvailable ? (
          <div className="flex justify-between">
      <WorkColumn
        title="Waiting For Approval"
        workCards={waitingForApproval}
        bgColor="bg-red-500"
        borderColor="border-red-500"
        emptyMessage="No work in To Do"
      />

      <WorkColumn
        title="In Progress"
        workCards={inProgressWork}
        bgColor="bg-yellow-500"
        borderColor="border-yellow-500"
        emptyMessage="No work in Progress"
      />

      <WorkColumn
        title="Completed / Paid"
        workCards={completedWork}
        bgColor="bg-green-500"
        borderColor="border-green-500"
        emptyMessage="No work in Completed"
      />
      </div>
        ) : (
          <div className=" shadow-lg rounded-2xl w-full h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center p-4">
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
        )
          
      }
      
    </div>
  );
};

export default WorkerDashboard;
