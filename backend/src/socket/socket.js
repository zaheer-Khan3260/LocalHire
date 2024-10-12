import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("Socket connected ID:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    }

    socket.on("disconnect", () => {
        console.log("Socket disconnected ID:", socket.id);
        for (const [key, value] of userSocketMap.entries()) {
            if (value === socket.id) {
                userSocketMap.delete(key);
                break;
            }
        }
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });

    socket.on("sendMessage", (messageData) => {
        const receiverSocketId = userSocketMap.get(messageData.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageData);
        }
    });

    socket.on("notification", (newNotification) => {
        const receiverSocketId = userSocketMap.get(newNotification.workerId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("notification", newNotification);
        }
    });

    socket.on("deleteMessage", (data) => {
        const { messageId, conversationId, senderId, receiverId } = data;
        const receiverSocketId = userSocketMap.get(receiverId);
        const senderSocketId = userSocketMap.get(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", { messageId, conversationId });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", { messageId, conversationId });
        }
    });
});

export const getReceiverSocketId = (receiverId) => userSocketMap.get(receiverId);

export { app, io, server };