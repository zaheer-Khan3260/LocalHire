import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = asyncHandler(async(req, res) => {
    try {
        const { message, recieverId, senderId } = req.body;
        
        if(!message) throw new ApiError(401, "message is required");
        if(!recieverId) throw new ApiError(401, "reciever Id is required");
        if(!senderId) throw new ApiError(401, "sender Id is required");
    
        let conversation = await Conversation.findOne({
            conversationBetween: {$all: [senderId, recieverId]}
        })
    
        if(!conversation) {
            conversation = new Conversation({
                conversationBetween: [senderId, recieverId],
                messages: []
            });
        }
    
        const newMessage = new Message({
            senderId,
            recieverId,
            message
        })

        if(newMessage) {
            conversation.messages.push(newMessage?._id)
        }
    
        await Promise.all([conversation.save(), newMessage.save()])

        // Emit the new message to both sender and receiver
        const recieverSocketId = getReceiverSocketId(recieverId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }
        
        const senderSocketId = getReceiverSocketId(senderId)
        if(senderSocketId){
            io.to(senderSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                newMessage,
                "Message created successfully"
            )
        )
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }

})

export const getMessage = asyncHandler(async(req, res) => {

    try {
        const { userToChat } = req.body
        if(!userToChat) throw new ApiError(400, "User to chat id is required")
        const senderId = req.user?._id;
        const conversation = await Conversation.findOne({
            conversationBetween: {$all: [senderId, userToChat]}
        }).populate("messages")

        if(!conversation) {return res.status(200).json(new ApiResponse(
            200,
            [],
            "There is NO convertion between you two"
        ))}
        const message = conversation.messages

        return res.status(201).json(
            new ApiResponse(
                201,
                message,
                "Fetching conversation successfully "
            )
        )
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
})

export const getConversation = asyncHandler(async(req, res) => {
    const { senderId }= req.body


    if(!senderId) throw new ApiError(400, "sender Id is required")
    const conversation = await Conversation.find({
        conversationBetween: {$all: [senderId]}
    }).populate("conversationBetween").populate("messages")
    if(!conversation) return res.status(200).json(
        new ApiResponse(
            200,
            [],
            "You didn't send message anyone"
        )
    )
    return res.status(201).json(
        new ApiResponse(201,
            conversation,
            "Fetch conversation successfully"
        )
    )
})

export const getConversationById = asyncHandler(async(req, res) => {
    const {conversationId} = req.body
    if(!conversationId) throw new ApiError(400, "Conversation id required")
    const conversation = await Conversation.findById(conversationId).populate("conversationBetween").populate("messages")
    if(!conversation) return res.status(200).json(
        new ApiResponse(
            200,
            [],
            "You didn't send message anyone"
        )
    )
    return res.status(201).json(
        new ApiResponse(201,
            conversation,
            "Fetch conversation successfully"
        )
    )
})

export const deleteMessage = asyncHandler(async(req, res) => {
    const {messageId, conversationId, senderId, receiverId} = req.body;

    if(!messageId) throw new ApiError(400, "Message Id is required");
    if(!conversationId) throw new ApiError(400, "Conversation Id is required");
    if(!senderId) throw new ApiError(400, "Sender Id is required");
    if(!receiverId) throw new ApiError(400, "Receiver Id is required");

    const messageDataDelete = await Message.findByIdAndDelete(messageId);
    if(!messageDataDelete) throw new ApiError(404, "Failed to delete the message");

    // Remove the message from the conversation
    await Conversation.findByIdAndUpdate(conversationId, {
        $pull: { messages: messageId }
    });

    // Emit socket event for message deletion
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", { messageId, conversationId });
    }
    if (senderSocketId) {
        io.to(senderSocketId).emit("messageDeleted", { messageId, conversationId });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { messageId, conversationId },
            "Message deleted successfully"
        )
    )
})