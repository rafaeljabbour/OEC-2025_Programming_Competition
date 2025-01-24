// server.js
require('dotenv').config(); // Load .env
const express = require('express');
const path = require('path');

// DB connect function
const { connect } = require('./db/connection');

// Import routes
const userRoutes = require('./routes/userRoutes');

// Initialize Express
const app = express();

// Parse JSON in request body
app.use(express.json());

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Use the user routes at /api/users
app.use('/api/users', userRoutes);

// Start server
async function startServer() {
    try {
        await connect(); // Connect to MongoDB
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();
