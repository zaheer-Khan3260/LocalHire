
import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    senderName : {
        type: String,
    },
    senderProfileImage: {
        type: String,
    },
    recieverId: {
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
