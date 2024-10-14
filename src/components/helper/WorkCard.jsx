import React from "react";
import defaultImage from "../../Icons/profile.jpeg";
import { customServerApi } from "../../utils/api.js";
import { Link } from "react-router-dom";
function WorkCard({ data, onJobStatusUpdate, isLoading, onClick }) {
  const acceptJob = async () => {
    if (!data._id) return;
    const response = await customServerApi.post(
      `/job/updateStatus/${data?._id}`,
      {
        status: "In Progress",
      }
    );

    if (response && response.status === 200) {
      // Call the callback function with the updated job data
      onJobStatusUpdate(response.data.data);
    }
  };

  const doneJob = async () => {
    if (!data._id) return;
    const response = await customServerApi.post(
      `/job/updateStatus/${data?._id}`,
      {
        status: "Completed",
      }
    );

    if (response && response.status === 200) {
      // Call the callback function with the updated job data
      onJobStatusUpdate(response.data.data);
    }
  };

  const deleteJob = async() => {
      const response = await customServerApi.get(`/job/deleteJob/${data?._id}`)
      if(response) {
        window.location.reload()
      }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse w-[25rem]  bg-gray-600 bg-opacity-45 h-24 rounded-lg shadow-md"></div>
    );
  }
  return (
    <div className="border-2 bg-[rgba(14,20,33,0.7)] border-[rgba(14,20,33,0.7)] shadow-xl transition-scale duration-300 hover:scale-105 w-[25rem] rounded-xl p-3">
      {/* Image and name container */}
      <div className="w-full border-slate-600 border-b-2 h-24 flex gap-2  ">
        <Link to={`/profile/${data?.clientId}`}>
        <div className="w-20 h-20 rounded-full">
          <img
            src={data?.clientProfileImage ? data?.clientProfileImage : defaultImage}
            alt=""
            className="w-20 h-20 rounded-full"
          />
        </div>
        </Link>
        <div className="mt-1 ml-4">
          <h2 className="text-xl font-semibold">{data?.clientName}</h2>
          <p className="text-sm text-gray-600">{data?.clientNumber}</p>
          <p className="text-sm text-gray-600">{data?.clientEmail}</p>
        </div>
        <div className=" text-end h-fit mt-1 p-1 ml-28 cursor-pointer relative group" onClick={onClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7142857142857142"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-mail"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <div className=" absolute top-[-20px] opacity-0 right-0 p-1 text-[11px] group-hover:opacity-100 transition-all duration-500">
            Message
          </div>
        </div>
      </div>
      {/* job discription container */}
      <div className="w-full mt-3 text-sm ">{data?.description}</div>
      {/* others detail container */}
      <div className=" w-full mt-8 flex justify-between items-end gap-2 cursor-pointer ">
        <div className="w-[70%] flex gap-3 text-center">
          <div
            className={`h-9 p-2 rounded-md text-sm ${
              data?.status === "Waiting For Approval"
                ? "bg-purple-500"
                : data?.status === "In Progress"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {data?.status}
          </div>
          <div className="h-9 p-2 bg-slate-500 rounded-md ">
            Price: {data?.amount}
          </div>
        </div>
        <div className="w-[30%] ">
          <h4
            className={`bg-red-500 mb-3 hover:bg-red-700 duration-300 transition-all rounded-md px-1 py-2 text-center ${
              data?.status === "Waiting For Approval" ? "block" : "hidden"
            }`}
            onClick={deleteJob}
          >
            Reject
          </h4>
          <h4
            onClick={() =>
              data?.status === "Waiting For Approval" ? acceptJob() : doneJob()
            }
            className={`bg-blue-500 hover:bg-blue-700 duration-300 transition-all rounded-md px-1 py-2 text-center ${
              data?.status === "Completed" ? "hidden" : null
            }`}
          >
            {data?.status === "Waiting For Approval" ? "Accept" : "Done"}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default WorkCard;
