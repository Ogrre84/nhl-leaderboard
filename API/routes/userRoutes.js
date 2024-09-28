const express = require('express');
const User = require('../models/userModel'); // Adjust the path as necessary
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    const { username } = req.body;
    try {
        const newUser = new User({ username });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
