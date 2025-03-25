import User from "../Models/user.model.js"; // User model ko import kar rahe hain
import Message from "../Models/message.model.js"; // Message model ko import kar rahe hain

import cloudinary from "../Utils/cloudinary.js"; // Cloudinary utility ko import kar rahe hain

import { getReceiverSocketId, io } from "../Utils/socket.js"; // Socket utilities ko import kar rahe hain

// Sidebar ke liye users ko fetch karne ka function
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Logged-in user ka ID le rahe hain
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // Logged-in user ko chhod kar sabhi users ko fetch kar rahe hain

        res.status(200).json(filteredUsers); // Users ko response mein bhej rahe hain
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ error: "Internal server error" }); // Error response bhej rahe hain
    }
};

// Messages ko fetch karne ka function
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // URL params se user ID le rahe hain
        const myId = req.user._id; // Logged-in user ka ID le rahe hain

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId }, // Ya to logged-in user ne bheja ho
                { senderId: userToChatId, receiverId: myId }, // Ya phir us user ne logged-in user ko bheja ho
            ],
        });

        res.status(200).json(messages); // Messages ko response mein bhej rahe hain
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ error: "Internal server error" }); // Error response bhej rahe hain
    }
};

// Message bhejne ka function
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body; // Request body se text aur image le rahe hain
        const { id: receiverId } = req.params; // URL params se receiver ID le rahe hain
        const senderId = req.user._id; // Logged-in user ka ID le rahe hain

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image); // Image ko Cloudinary par upload kar rahe hain
            imageUrl = uploadResponse.secure_url; // Uploaded image ka URL le rahe hain
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // Socket.io code to emit the message to the receiver
        const receiverSocketId = getReceiverSocketId(receiverId); // Receiver ka socket ID le rahe hain
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // Receiver ko new message emit kar rahe hain
        }

        await newMessage.save(); // New message ko database mein save kar rahe hain

        res.status(201).json(newMessage); // Response mein new message bhej rahe hain
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ error: "Internal server error" }); // Error response bhej rahe hain
    }
};