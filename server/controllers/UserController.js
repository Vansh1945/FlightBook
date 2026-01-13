import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        data: null
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        data: null
      });
    }

    // Create user (password hashing is handled in the model pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    // Create wallet with initial balance 50000
    const wallet = new Wallet({ userId: user._id, balance: 50000 });
    await wallet.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: null
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7h' });

    // Fetch wallet balance
    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, wallet_balance: wallet.balance }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};

// Get logged-in user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user data (exclude password)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Fetch wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        walletBalance: wallet.balance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile
};
