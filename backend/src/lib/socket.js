import { Server } from "socket.io";
import Message from "../models/message.model.js";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === "production" ? true : ["http://localhost:3000", "http://localhost:5173"],
            credentials: true,
        },
    });

    const userSockets = new Map();
    const userActivities = new Map();

    const broadcastPresence = () => {
        io.emit("users_online", Array.from(userSockets.keys()));
        io.emit("activities", Array.from(userActivities.entries()));
    };

    io.on("connection", (socket) => {
        const handleUserConnect = (userId) => {
            if (!userId) return;
            userSockets.set(userId, socket.id);
            if (!userActivities.has(userId)) {
                userActivities.set(userId, "Idle");
            }

            io.emit("user_connected", userId);
            broadcastPresence();
        };

        const authUserId = socket.handshake.auth?.userId;
        if (authUserId) {
            handleUserConnect(authUserId);
        }

        socket.on("user_connected", (userId) => {
            handleUserConnect(userId);
        });

        socket.on("update_activity", ({ userId, activity }) => {
            if (!userId) return;
            userActivities.set(userId, activity);
            io.emit("activity_updated", { userId, activity });
            broadcastPresence();
        });

        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data;
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                });

                const receiverSocketId = userSockets.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }

                socket.emit("message_sent", message);
            } catch (error) {
                console.error("Message error:", error);
                socket.emit("message_error", error.message);
            }
        });

        socket.on("disconnect", () => {
            let disconnectedUserId;
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSockets.delete(userId);
                    userActivities.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                io.emit("user_disconnected", disconnectedUserId);
                broadcastPresence();
            }
        });
    });
};
