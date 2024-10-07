import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    conversationBetween: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],

    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ]
},{
    timestamps: true
})

export const Conversation = mongoose.model("Conversation", conversationSchema)