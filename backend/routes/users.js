const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

// @route   GET /api/users
// @desc    Get all users for chat functionality
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('username userType walletAddress');
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/users/contacts/add/:userId
// @desc    Add a user to business associates/contacts
// @access  Private
router.post('/contacts/add/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const userToAddId = req.params.userId;

    const userToAdd = await User.findById(userToAddId);
    if (!userToAdd) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    if (currentUser.businessAssociates.includes(userToAddId)) {
      return res.status(400).json({ msg: 'User already in contacts' });
    }

    currentUser.businessAssociates.push(userToAddId);
    await currentUser.save();

    const updatedUser = await User.findById(currentUserId)
      .populate('businessAssociates', 'username email userType walletAddress isOnline');

    res.json({
      msg: 'User added to contacts',
      contacts: updatedUser.businessAssociates
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/users/contacts/remove/:userId
// @desc    Remove a user from business associates/contacts
// @access  Private
router.delete('/contacts/remove/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const userToRemoveId = req.params.userId;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser.businessAssociates.includes(userToRemoveId)) {
      return res.status(400).json({ msg: 'User not in contacts' });
    }

    currentUser.businessAssociates = currentUser.businessAssociates
      .filter(userId => userId.toString() !== userToRemoveId);
    await currentUser.save();

    const updatedUser = await User.findById(currentUserId)
      .populate('businessAssociates', 'username email userType walletAddress isOnline');

    res.json({
      msg: 'User removed from contacts',
      contacts: updatedUser.businessAssociates
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/users/profile
// @desc    Update user profile
// @access  Private
router.post('/profile', auth, async (req, res) => {
  try {
    const { userType, walletAddress, businessNumber, businessName } = req.body;
    const userId = req.user.id;

    const updateFields = {};
    if (userType && userType !== '') updateFields.userType = userType;
    if (walletAddress && walletAddress !== '') updateFields.walletAddress = walletAddress;

    // Check if businessNumber or businessName already exists
    if (businessNumber) {
      const existingBusinessNumber = await User.findOne({ businessNumber });
      if (existingBusinessNumber && existingBusinessNumber._id.toString() !== userId) {
        return res.status(400).json({ msg: 'Business number already exists' });
      }
      updateFields.businessNumber = businessNumber;
    }

    if (businessName) {
      const existingBusinessName = await User.findOne({ businessName });
      if (existingBusinessName && existingBusinessName._id.toString() !== userId) {
        return res.status(400).json({ msg: 'Business name already exists' });
      }
      updateFields.businessName = businessName;
    }

    // Update the user
    await User.findByIdAndUpdate(userId, updateFields, { new: true });

    const updatedUser = await User.findById(userId);
    res.json({
      userType: updatedUser.userType || '',
      walletAddress: updatedUser.walletAddress || ''
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
