import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from "../configs/nodemailer.js";
import { text } from "express";
import Booking from "../models/booking.js";


// new user registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: 'All details are compulsory',
        })
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists',
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to FlimFlare',
            text: `Welcome to FlimFlare website. Your account has been created with email id: ${email} .`
        }
        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: 'User Created successfully',
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    
    if (!email || !password) {
        return res.json({
            success: false,
            message: 'Both Email and password is required',
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid Email',
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid Password',
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({
            success: true,
            message: 'Logged in successfully',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//user logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({
            success: true,
            message: 'Logged out successfully!'
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//Sending verification otp to user email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: 'User email already verified',
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        }
        await transporter.sendMail(mailOption);
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        res.json({
            success: true,
            message: 'Verification OTP sent to User Email',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//get otp and verify account
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({
            success: false,
            message: 'Details not found',
        })
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: 'Invalid OTP',
            })
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'Verification OTP expired. Try again',
            })
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({
            success: true,
            message: 'Email verified successfully',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//check if user already logged 
export const isAUthenticated = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not logged in',
            })
        }
        return res.json({
            success: true,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//send reset password otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            message: 'Email is required',
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User with this email not found',
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. Reset your password using this OTP.`,
        }
        await transporter.sendMail(mailOption);
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000;
        user.save();
        return res.json({
            success: true,
            message: 'Reset OTP send to Email',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }

}

//reset user password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    console.log(email, otp, newPassword);

    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: 'Email, OTP, or new Password is missing',
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found.',
            })
        }
        if (user.resetOtp == '' || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: 'Invalid OTP.',
            })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired. Please try again.',
            })
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({
            success: true,
            message: 'Password updated successfully.',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }

}

//Get user data
export const getUserData = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({
            success: false,
            message: 'UserId not found',
        })
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            })
        }
        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.body;
        const bookings = await Booking.find({ user:userId }).populate({
            path: "show",
            populate: {
                path: "movie"
            }
        }).sort({ createdAt: -1 });
        // console.log(userId);
        // console.log(bookings);
        
        res.json({
            success: true,
            bookings
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

//get favorite movies
export const toggleFavorite = async (req, res) => {
    try {
        const { userId, movieId } = req.body;
        if (!userId || !movieId) {
            return res.json({
                success: false,
                message: 'Not found'
            })
        }
        const user=await User.findById(userId);
        if(!user){
            return res.json({
                success: false,
                message: 'User not found'
            })
        }
        const alreadyInFavorites = user.favorite.includes(movieId);
        if(!alreadyInFavorites){
            user.favorite.push(movieId);
        }
        else{
            user.favorite = user.favorite.filter(id => id !== movieId);
        }
        await user.save();
        return res.json({
            success:true,
            message:alreadyInFavorites ? 'Removed From Favorites': 'Added to Favorites'
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//get favorite movies
export const getFavorite=async (req,res) => {
    try {
        const {userId}=req.body;
        const user=await User.findById(userId).populate('favorite')
        const favorites=user.favorite;
        res.json({
            success:true,
            favorites,
        })
    } catch (error) {
        return res.json({
            success:false,
            error:error.message
        })
    }
}
