import React from "react";
import { useForm } from "react-hook-form";
import defaultImage from "../../Icons/profile.jpeg";
import { customServerApi } from "../../utils/api";
import useFetchCurrentUserData from "../../hooks/useFetchCurrentUserData";
import { useNavigate } from "react-router";

function JobForm({ _id, name, designation, profileImage, onClick }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate()
  const userData = useFetchCurrentUserData();


  const onSubmit = async(data) => {
    if(!data) return;

    try {
      const jobDetails = {
        clientName : userData?.name,
        clientEmail: userData?.email,
        clientNumber: userData?.number,
        clientId: userData?._id,
        status: "Waiting For Approval",
        amount: data?.amount,
        description: data?.description,
        timing: data?.timing,
        workerId: _id,
        workerName: name,
        workerProfileImage: profileImage,
        clientProfileImage: userData?.profileImage
      }
      console.log("jobdetails: ", jobDetails);
      const response = await customServerApi.post("/job/createJob", jobDetails)
      if(response){
        document.querySelector('.closeButton').click();
      }
    } catch (error) {
     console.log("An error while Hiring: ", error) 
    }
    
  };

  return (
    <div className="border-2 rounded-lg border-primaryCardColor w-[30rem] h-[38rem] bg-primaryCardColor p-4">
      <div
        className="closeButton cursor-pointer w-full flex justify-end"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>
      <div className="flex items-center gap-5">
        <div className="w-28 h-28 rounded-full">
          <img
            src={profileImage ? profileImage : defaultImage}
            alt=""
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-2xl font-semibold">{name}</h4>
          <p className="text-gray-400 mt-1">{designation}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="h-auto mt-5 px-2">
        <label className="block text-md font-medium text-gray-500 mb-3">
          Job Description:
        </label>
        <textarea
          {...register("description", {
            required: "Job description is required",
            maxLength: 150,
          })}
          placeholder="eg: create a wooden table"
          rows="3"
          className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor"
        />
        {errors.jobDescription && (
          <p className="text-red-500">{errors.jobDescription.message}</p>
        )}
        <div id="word-count" className="text-right text-gray-400 mt-1">
          {watch("description")?.length || 0}/150
        </div>

        <div>
          <label className="block text-md font-medium text-gray-500 mb-3">
            Price:
          </label>
          <input
            type="number"
            {...register("amount", { required: "Price is required", min: 0 })}
            placeholder="eg: 2000, 500"
            className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="mt-2">
          <label className="block text-md font-medium text-gray-500 mb-3">
            Timing:
          </label>
          <select
            {...register("timing", { required: "Timing is required" })}
            className="w-full p-2 border-2 border-gray-500 rounded-md bg-primaryCardColor"
          >
            <option value="">Select Timing</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Custom">Custom Date</option>
          </select>
          {errors.timing && (
            <p className="text-red-500">{errors.timing.message}</p>
          )}
        </div>

        <div className="mt-8 w-full text-end">
          <button
            type="submit"
            className="w-28 font-semibold p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Hire
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
