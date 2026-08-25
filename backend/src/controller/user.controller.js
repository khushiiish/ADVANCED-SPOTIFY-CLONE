import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

const getAuthUserId = (req) => {
    try {
        const auth = getAuth(req);
        if (auth?.userId) return auth.userId;
    } catch {
        // Ignore and fallback
    }
    if (typeof req.auth === 'function') {
        try {
            return req.auth()?.userId;
        } catch {
            return null;
        }
    }
    return req.auth?.userId || null;
};

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = getAuthUserId(req);
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const myId = getAuthUserId(req);
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};