import bcrypt from "bcryptjs"; // bcryptjs module ko import kar rahe hain
import User from "../Models/user.model.js"; // User model ko import kar rahe hain

import { generateToken } from "../Utils/generate.token.js"; // Token generate karne ke utility function ko import kar rahe hain
import cloudinary from "../Utils/cloudinary.js"; // Cloudinary utility ko import kar rahe hain

// Signup function
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body; // Request body se fullName, email aur password le rahe hain
    try {
        if (!fullName || !email || !password) { // Agar koi field missing hai to error response bhej rahe hain
            return res.status(400).json({ message: "All fields are required" });
        }

        function isValidEmail(email) { // Email validate karne ka function
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        if (isValidEmail(email) === false) { // Agar email invalid hai to error response bhej rahe hain
            return res.status(400).json({ message: "Invalid email" });
        }

        if (password.length < 6) { // Agar password 6 characters se chhota hai to error response bhej rahe hain
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        function containsNumberOrSpecialChar(str) { // Password mein number ya special character check karne ka function
            const regex = /[0-9!@#$%^&*(),.?":{}|<>]/;
            return regex.test(str);
        }

        if (containsNumberOrSpecialChar(password) === false) { // Agar password mein number ya special character nahi hai to error response bhej rahe hain
            return res.status(400).json({ message: "Password must contain a number or special character" });
        }

        const user = await User.findOne({ email }); // Database mein email check kar rahe hain

        if (user) return res.status(400).json({ message: "Email already exists" }); // Agar email already exist karta hai to error response bhej rahe hain

        const salt = await bcrypt.genSalt(10); // Password hash karne ke liye salt generate kar rahe hain
        const hashedPassword = await bcrypt.hash(password, salt); // Password ko hash kar rahe hain

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) { // Agar new user create ho gaya to token generate kar rahe hain aur user ko save kar rahe hain
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" }); // Agar user create nahi ho paya to error response bhej rahe hain
        }
    } catch (error) {
        console.log("Error in signup controller", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ message: "Internal Server Error" }); // Error response bhej rahe hain
    }
};

// Login function
export const login = async (req, res) => {
    const { email, password } = req.body; // Request body se email aur password le rahe hain
    try {
        const user = await User.findOne({ email }); // Database mein email check kar rahe hain

        if (!user) { // Agar user nahi mila to error response bhej rahe hain
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password); // Password compare kar rahe hain
        if (!isPasswordCorrect) { // Agar password incorrect hai to error response bhej rahe hain
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res); // Token generate kar rahe hain

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ message: "Internal Server Error" }); // Error response bhej rahe hain
    }
};

// Logout function
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 }); // JWT cookie ko clear kar rahe hain
        res.status(200).json({ message: "Logged out successfully" }); // Success response bhej rahe hain
    } catch (error) {
        console.log("Error in logout controller", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ message: "Internal Server Error" }); // Error response bhej rahe hain
    }
};

// Profile update function
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body; // Request body se profilePic le rahe hain
        const userId = req.user._id; // Logged-in user ka ID le rahe hain

        if (!profilePic) { // Agar profilePic missing hai to error response bhej rahe hain
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // ProfilePic ko Cloudinary par upload kar rahe hain
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser); // Updated user ko response mein bhej rahe hain
    } catch (error) {
        console.log("error in update profile:", error); // Error ko console mein print kar rahe hain
        res.status(500).json({ message: "Internal server error" }); // Error response bhej rahe hain
    }
};

// Check authentication function
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user); // Logged-in user ko response mein bhej rahe hain
    } catch (error) {
        console.log("Error in checkAuth controller", error.message); // Error ko console mein print kar rahe hain
        res.status(500).json({ message: "Internal Server Error" }); // Error response bhej rahe hain
    }
};