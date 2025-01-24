////////////////////////////////////////////////////////////
// server.js
////////////////////////////////////////////////////////////
require('dotenv').config(); // If you use an .env file for MONGO_URI
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// 1) MongoDB Atlas connection
// Replace with your actual Atlas URI / credentials:
const uri = process.env.MONGO_URI || "mongodb+srv://USERNAME:PASSWORD@clustername.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db;

// 2) Start server + connect to MongoDB
async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        // Choose a database name, e.g. "disasterDB"
        db = client.db("disasterDB");

        // 3) Create an Express app
        const app = express();
        app.use(express.json());

        // 4) Serve static frontend files from "public" folder
        app.use(express.static(path.join(__dirname, 'public')));

        // -----------------------------------------------
        // 5) API endpoints for "disasters" collection
        // -----------------------------------------------
        // Each document looks like:
        // {
        //   _id: ObjectId(...),
        //   disasterType: "Fire" | "Flood" | "Earthquake" | "Custom",
        //   coords: [lng, lat],
        //   color: "#ff0000", // optional for custom
        //   notes: [ { _id: ObjectId, text: "...", time: Date }, ... ],
        //   createdAt: Date
        // }

        // GET /api/disasters => return all disasters
        app.get('/api/disasters', async (req, res) => {
            try {
                const disasters = await db.collection('disasters').find({}).toArray();
                res.json(disasters);
            } catch (err) {
                console.error('Error fetching disasters:', err);
                res.status(500).json({ error: 'Failed to fetch disasters' });
            }
        });

        // POST /api/disasters => create a new disaster
        // expects body { disasterType, coords: [lng, lat], color, notes? }
        app.post('/api/disasters', async (req, res) => {
            try {
                let { disasterType, coords, color } = req.body;
                if (!coords || coords.length !== 2) {
                    return res.status(400).json({ error: 'Invalid coords array' });
                }
                if (!disasterType) disasterType = 'Custom';

                // Insert doc
                const newDoc = {
                    disasterType,
                    coords,
                    color: color || null,
                    notes: [],             // start with empty notes array
                    createdAt: new Date()
                };
                const result = await db.collection('disasters').insertOne(newDoc);

                // Return the created doc (including the new _id)
                newDoc._id = result.insertedId;
                res.status(201).json(newDoc);
            } catch (err) {
                console.error('Error creating disaster:', err);
                res.status(500).json({ error: 'Failed to create disaster' });
            }
        });

        // POST /api/disasters/:id/notes => add a new note to the given disaster
        // expects body { text }
        app.post('/api/disasters/:id/notes', async (req, res) => {
            try {
                const disasterId = req.params.id;
                const { text } = req.body;
                if (!text) {
                    return res.status(400).json({ error: 'Note text is required' });
                }

                const noteObj = {
                    _id: new ObjectId(),
                    text,
                    time: new Date().toLocaleString()
                };

                const result = await db.collection('disasters').findOneAndUpdate(
                    { _id: new ObjectId(disasterId) },
                    { $push: { notes: noteObj } },
                    { returnDocument: 'after' }
                );

                if (!result.value) {
                    return res.status(404).json({ error: 'Disaster not found' });
                }
                // return the updated doc
                res.json(result.value);
            } catch (err) {
                console.error('Error adding note:', err);
                res.status(500).json({ error: 'Failed to add note' });
            }
        });

        // 6) Listen on a port
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB Atlas:", err);
    }
}

// 7) Start the server
startServer();
