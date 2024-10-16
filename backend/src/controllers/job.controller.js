import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";  
import { Job } from "../model/job.model.js";
import mongoose from "mongoose";
import validator from 'validator';
import { Notification } from "../model/notification.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createJob = async (req, res, next) => {
    try {
        const {
            clientName,
            clientEmail,
            clientNumber,
            clientId,
            status,
            amount,
            description,
            timing,
            workerId,
            workerName,
            workerProfileImage,
            clientProfileImage
        } = req.body;

        // Validation
        if (!clientName || !clientEmail || !status || !amount || !description || !timing || !workerId || !clientId) {
            throw new ApiError(400, 'All fields are required');
        }

        if (typeof clientName !== 'string' || clientName.trim().length === 0) {
            throw new ApiError(400, 'Client name must be a non-empty string');
        }

        if (!validator.isEmail(clientEmail)) {
            throw new ApiError(400, 'Invalid email format');
        }

        const validStatuses = ['Waiting For Approval', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, `Status must be one of the following: ${validStatuses.join(', ')}`);
        }

        if (!validator.isNumeric(amount.toString()) || parseFloat(amount) <= 0) {
            throw new ApiError(400, 'Amount must be a positive number');
        }

        if (typeof description !== 'string' || description.trim().length === 0 || description.length > 150) {
            throw new ApiError(400, 'Description must be a non-empty string and less than 150 characters');
        }

        const validTimings = ['Today', 'Tomorrow', 'Custom'];
        if (!validTimings.includes(timing)) {
            throw new ApiError(400, `Timing must be one of the following: ${validTimings.join(', ')}`);
        }

        if (!mongoose.Types.ObjectId.isValid(workerId) || !mongoose.Types.ObjectId.isValid(clientId)) {
            throw new ApiError(400, 'Invalid worker ID or client ID');
        }

        // Create and save the job
        const newJob = new Job({
            clientName,
            clientEmail,
            clientNumber,
            clientId,
            status,
            amount,
            description,
            timing,
            workerId,
            workerName,
            workerProfileImage,
            clientProfileImage
        });

        const savedJob = await newJob.save();

        // Create and save the notification
        const notification = new Notification({
            senderName: clientName,
            senderProfileImage: clientProfileImage,
            recieverId: workerId,
            seen: false,
            notificationMessage: "Wants to hire you",
        });

        const savedNotification = await notification.save();

        // Emit socket event
        const receiverSocketId = getReceiverSocketId(workerId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('notification', savedNotification);
        }

        return res.status(201).json(new ApiResponse(201, savedJob, 'Job created successfully'));
    } catch (error) {
        next(error);
    }
};

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
        const notificationMessage = status === "In Progress" ? `Accept Your Job, Message ${updatedJob.workerName} for more information`
                                    : `${updatedJob.workerName} is completed your work.`
        const notification = new Notification({
            senderName: updatedJob.workerName,
            senderProfileImage: updatedJob.workerProfileImage,
            recieverId: updatedJob.clientId,
            seen: false,
            notificationMessage 
        })

        if(notification) {
        const savedNotification = await notification.save()
        
            const receiverSocketId = getReceiverSocketId(updatedJob.clientId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit("notification", savedNotification);
            }  
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



export const getNotification = asyncHandler(async(req, res) => {
    const recieverId = req.params.id;

    if (!recieverId) {
        throw new ApiError(400, 'Worker ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(recieverId)) {
        throw new ApiError(400, 'Invalid worker ID format');
    }

    try {  
        const notifications = await Notification.find({ recieverId });

        if (!notifications) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found for the worker',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notifications fetched successfully',
            data: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new ApiError(500, 'An error occurred while fetching notifications');
    }
});

export const deleteJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    if (!jobId) {
        throw new ApiError(400, 'Job ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, 'Invalid job ID format');
    }

    try {
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }
        console.log("finded job in controller: ", job);
        // Delete the job
        await Job.findByIdAndDelete(job._id);

        // Send notification to the client that the worker has rejected the job
        const notification = new Notification({
            senderName: job?.workerName,
            senderProfileImage: job?.workerProfileImage,
            recieverId: job?.clientId,
            seen: false,
            notificationMessage: "Reject Your Job"
        });
        await notification.save();

        // Emit the notification to the client
        const clientId = job.clientId;
        const clientSocketId = await getReceiverSocketId(clientId);
        if (clientSocketId) {
            io.to(clientSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
            data: job,
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        throw new ApiError(500, 'An error occurred while deleting the job');
    }
});