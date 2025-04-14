const express = require('express');
const router = express.Router();

const { Product, Attribute, Order, OrderItem, CartItem, User } = require('../lib/associations');

// Endpoint to check current logged-in user
router.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// New registration endpoint to store user data
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate that both email and password are provided.
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Use the email as the username if no separate username field is provided.
        const username = email;

        // Check whether a user with the given email already exists.
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Create a new user with the provided data (no password encryption is applied).
        const newUser = await User.create({ username, email, password });
        req.session.user = newUser; // auto login the user to the session
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: newUser
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

// Sign-in endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Save user details to session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.json({ success: true, message: 'Logged in successfully.' });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out.' });
        }
        res.json({ success: true });
    });
});

module.exports = router;