////////////////////////////////////////////////////////////
// server.js
////////////////////////////////////////////////////////////
require('dotenv').config(); // If you use an .env file for MONGO_URI
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const { Expo } = require('expo-server-sdk');

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

// 2) Start server + connect to MongoDB
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

// 7) Start the server
startServer();