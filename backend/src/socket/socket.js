import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("socket connected ID:", socket.id)
    const userId = socket.handshake.query.userId;
    if(userId !== undefined) userSocketMap[userId] = socket.id;

    // io.emit is used to send a message to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("socket disconnected ID:", socket.id)

        const disconnectedUser = Object.keys(userSocketMap)
        .find(key => userSocketMap[key] === socket.id)
        if(disconnectedUser){
        delete userSocketMap[disconnectedUser];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    // Add this event listener for sending messages
    socket.on("sendMessage", (messageData) => {
        const receiverSocketId = userSocketMap[messageData.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageData);
        }
    });

    // Add this event listener for deleting messages
    socket.on("deleteMessage", (data) => {
        const { messageId, conversationId, senderId, receiverId } = data;
        const receiverSocketId = userSocketMap[receiverId];
        const senderSocketId = userSocketMap[senderId];

        // Notify both sender and receiver about the deleted message
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", { messageId, conversationId });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", { messageId, conversationId });
        }
    });
});

export const getRecieverSocketId = (recieverId) => {
    return userSocketMap[recieverId];
}

export {app, io, server}
