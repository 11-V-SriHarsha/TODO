const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Signup attempt:', { username, email });

        // Create user
        const user = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        // Save user
        const savedUser = await user.save();
        console.log('User saved successfully:', savedUser._id);

        // Create token
        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.status(201).json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                error: `This ${field} is already registered`
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error creating user',
            details: error.message
        });
    }
});

// Add this new route to check registered users
router.get('/check-user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ 
            email: req.params.email.toLowerCase() 
        });
        res.json({ 
            exists: !!user,
            email: req.params.email.toLowerCase()
        });
    } catch (error) {
        res.status(500).json({ error: 'Error checking user' });
    }
});

// Modify the login route for better debugging
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        console.log('Login attempt for:', cleanEmail);

        // Find user with case-insensitive email
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            console.log('No user found with email:', cleanEmail);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        console.log('User found, checking password');
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        console.log('Password matched, creating token');
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful');
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during login'
        });
    }
});

module.exports = router;
