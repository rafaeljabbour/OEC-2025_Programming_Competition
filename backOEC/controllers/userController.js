// controllers/userController.js
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

/**
 * Create a user (with hashed password)
 */
async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing name, email, or password' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUserId = await UserModel.createUser({
            name,
            email,
            password: hashedPassword
        });

        // Return user ID (but not password) to client
        return res.status(201).json({ _id: newUserId, name, email });
    } catch (err) {
        console.error('Error in createUser:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Login user (check password)
 */
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }

        // Find user by email
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' }); // or 404
        }

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If password matches, login is successful
        // (You might generate a JWT or session here)
        return res.json({ message: 'Login successful!' });
    } catch (err) {
        console.error('Error in loginUser:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Fetch all users (excluding password from response)
 */
async function getUsers(req, res) {
    try {
        const users = await UserModel.findAll();
        // remove password field from each user
        const safeUsers = users.map(({ password, ...rest }) => rest);
        return res.json(safeUsers);
    } catch (err) {
        console.error('Error in getUsers:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Fetch user by ID (including password in response)
 */
async function getUserById(req, res) {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Return the full user document (including password)
        return res.json(user);
    } catch (err) {
        console.error('Error in getUserById:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Update user by ID
 */
async function updateUser(req, res) {
    try {
        const updatedUser = await UserModel.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...rest } = updatedUser;
        return res.json(rest);
    } catch (err) {
        console.error('Error in updateUser:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Delete user by ID
 */
async function deleteUser(req, res) {
    try {
        const deletedCount = await UserModel.deleteUser(req.params.id);
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error in deleteUser:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Search users by query
 */
async function searchUsers(req, res) {
    try {
        const { q } = req.query; // e.g. ?q=someText
        const results = await UserModel.searchByQuery(q);
        // exclude password from each user
        const safeResults = results.map(({ password, ...rest }) => rest);
        return res.json(safeResults);
    } catch (err) {
        console.error('Error in searchUsers:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
};
