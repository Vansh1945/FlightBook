import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

// Get wallet balance for logged-in user
const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
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
      message: 'Wallet balance retrieved successfully',
      data: { walletBalance: wallet.balance }
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

// Deduct amount from wallet
const deductWalletAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
        data: null
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
        data: null
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
        data: null
      });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Amount deducted successfully',
      data: { walletBalance: wallet.balance }
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

// Reset wallet balance (for testing/admin purposes)
const resetWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
        data: null
      });
    }

    wallet.balance = 0;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Wallet reset successfully',
      data: { walletBalance: wallet.balance }
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
  getWalletBalance,
  deductWalletAmount,
  resetWallet
};
