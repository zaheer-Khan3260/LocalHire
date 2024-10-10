import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";  
import { Job } from "../model/job.model.js";
import mongoose from "mongoose";
import validator from 'validator';
import { io } from "../socket/socket.js";

export const createJob = asyncHandler(async(req, res) => {
    const { 
        clientName, 
        clientEmail, 
        clientNumber, 
        status, 
        amount, // Changed from price to amount to match the model
        description, // Corrected spelling from discription to description
        timing, 
        workerId,
        profileImage 
    } = req.body;

    // Validate required fields
    if (!clientName || !clientEmail || !clientNumber || !status || !amount || !description || !timing || !workerId) {
        throw new ApiError(400, 'All fields are required');
    }

    // Validate clientName
    if (typeof clientName !== 'string' || clientName.trim().length === 0) {
        throw new ApiError(400, 'Client name must be a non-empty string');
    }

    // Validate clientEmail
    if (!validator.isEmail(clientEmail)) {
        throw new ApiError(400, 'Invalid email format');
    }

    // Validate clientNumber
    if (!validator.isNumeric(clientNumber.toString()) || clientNumber <= 0) {
        throw new ApiError(400, 'Client number must be a positive number');
    }

    // Validate status
    const validStatuses = ['Waiting For Approval', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Status must be one of the following: ${validStatuses.join(', ')}`);
    }

    // Validate amount
    if (!validator.isNumeric(amount.toString()) || amount <= 0) {
        throw new ApiError(400, 'Amount must be a positive number');
    }

    // Validate description
    if (typeof description !== 'string' || description.trim().length === 0 || description.length > 150) {
        throw new ApiError(400, 'Description must be a non-empty string and less than 150 characters');
    }

    // Validate timing
    const validTimings = ['Today', 'Tomorrow', 'Custom'];
    if (!validTimings.includes(timing)) {
        throw new ApiError(400, `Timing must be one of the following: ${validTimings.join(', ')}`);
    }

    // Validate workerId
    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiError(400, 'Invalid worker ID');
    }

    // Create a new job
    const newJob = new Job({
        clientName,
        clientEmail,
        clientNumber,
        status,
        amount,
        description,
        timing,
        workerId,
        profileImage
    });

    // Save the job to the database
    const savedJob = await newJob.save();

    // Emit a socket event to notify the worker
    io.to(workerId).emit('jobCreated', {
        jobId: savedJob._id,
        message: `A new job has been created for you!`,
        jobDetails: savedJob
    });

    // Send a response back to the client
    return res.status(201).json(new ApiResponse(201, savedJob, 'Job created successfully'));
});

export const fetchJobByWorkerId = asyncHandler(async (req, res) => {
    const  workerId  = req.params.id;

    // Validate workerId
    if (!workerId) {
        throw new ApiError(400, 'Worker ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiError(400, 'Invalid worker ID format');
    }

    try {
        // Fetch jobs associated with the workerId
        const jobs = await Job.find({ workerId });

        // Check if jobs were found
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No jobs found for the specified worker ID',
                data: []
            });
        }

        // Send the response back to the client
        return res.status(200).json({
            success: true,
            message: 'Jobs fetched successfully',
            data: jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw new ApiError(500, 'An error occurred while fetching jobs');
    }
});

// Update job status
export const updateJobStatus = asyncHandler(async (req, res) => {
    const jobId = req.params.id; 

    if (!jobId) {
        throw new ApiError(400, 'Job ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, 'Invalid job ID format');
    }

    const { status } = req.body; // Get the new status from the request body

    // Validate status
    const validStatuses = ['Waiting For Approval', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Status must be one of the following: ${validStatuses.join(', ')}`);
    }

    try {
        // Find the job by ID and update its status
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { status },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        // Check if the job was found
        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Send the response back to the client
        return res.status(200).json({
            success: true,
            message: 'Job status updated successfully',
            data: updatedJob,
        });
    } catch (error) {
        console.error("Error updating job status:", error);
        throw new ApiError(500, 'An error occurred while updating the job status');
    }
});
