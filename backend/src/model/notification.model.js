
import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    clientName : {
        type: String,
        required: true
    },
    ClientProfileImage: {
        type: String,
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seen: {
        type: Boolean,
        required: true
    },
    notificationMessage: {
        type: String,
        required: [true, "Notification message is required"]
    }

},{timestamps: true})

export const Notification = mongoose.model("Notification", notificationSchema)
