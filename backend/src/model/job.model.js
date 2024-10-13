import mongoose, { Schema } from "mongoose";

// Define an enum for job status
const jobStatusEnum = ['Waiting For Approval', 'In Progress', 'Completed'];

const jobSchema = new Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true, // Remove whitespace
    },
    clientEmail: {
        type: String,
        required: [true, 'Client email is required'],
        trim: true,
        lowercase: true, // Store email in lowercase
        match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
    },
    clientNumber: {
        type: Number,
        min: [1000000000, 'Client number must be at least 10 digits'], // Example validation for phone number
        max: [9999999999, 'Client number must be at most 10 digits'], // Example validation for phone number
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        required: [true, 'Job status is required'],
        enum: {
            values: jobStatusEnum,
            message: 'Status must be one of the following: ' + jobStatusEnum.join(', '),
        },
    },
    amount: {
        type: Number,
        required: [true, 'Job amount is required'],
        min: [0, 'Amount must be a positive number'], // Ensure amount is positive
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true, // Remove whitespace
    },
    workerName: {
        type: String,
        required: [true, 'workerName is reuired'],
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker', // Assuming you have a Worker model
    },
    timing: {
        type: String,
        required: [true, "timing is required"]
    },
    clientProfileImage: {
        type: String,
        required: [true, "Profile image is required"]
    },
    workerProfileImage: {
        type: String,
        required: [true, "worker image is required"]
    }
}, { timestamps: true });

// Export the Job model
export const Job = mongoose.model("Job", jobSchema);
