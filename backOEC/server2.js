////////////////////////////////////////////////////////////
// server2.js
////////////////////////////////////////////////////////////
require('dotenv').config(); // If you use an .env with MONGO_URI, DB_NAME2, etc.
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// 1) MongoDB Atlas connection
// e.g. MONGO_URI in your .env
const uri = process.env.MONGO_URI || "mongodb+srv://username:password@oec2025.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db; // We'll assign later

async function startServer() {
    try {
        // 2) Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        // We'll use DB_NAME2 or fallback to "PinsDB"
        const dbName = process.env.DB_NAME2 || "PinsDB";
        db = client.db(dbName);
        console.log(`Using database: ${dbName}`);

        // 3) Create an Express app
        const app = express();
        app.use(express.json());

        // 4) Serve static frontend files (index.html, etc.) from "public" folder
        app.use(express.static(path.join(__dirname, 'public')));

        // ---------------------------------------------------------
        // 5) API Endpoints for the "pins" collection
        // ---------------------------------------------------------
        // Document shape:
        // {
        //   _id: ObjectId(...),
        //   type: "Fire" | "Flood" | "Earthquake" | "Custom" | "SafeHaven",
        //   coords: [lng, lat],
        //   color: "#ff0000" (optional),
        //   notes: [ { time, text } ],
        //   createdAt: Date
        // }

        const pinsCollection = db.collection('pins');

        // ---------------------------
        // SAFE HAVENS
        // ---------------------------
        // GET /api/safe-havens → find all pins where type = "SafeHaven"
        app.get('/api/safe-havens', async (req, res) => {
            try {
                const havens = await pinsCollection.find({ type: "SafeHaven" }).toArray();
                res.json(havens);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to get safe havens' });
            }
        });

        // POST /api/safe-havens → create a new "SafeHaven" pin
        // expects { name, coords: [lng, lat] }
        app.post('/api/safe-havens', async (req, res) => {
            try {
                const { name, coords } = req.body;
                if (!coords || coords.length !== 2) {
                    return res.status(400).json({ error: 'Invalid coords array' });
                }
                // Insert doc with type= "SafeHaven"
                const doc = {
                    type: "SafeHaven",
                    coords,
                    color: "#FFFF00", // yellow
                    notes: [],
                    createdAt: new Date()
                };
                // Optionally store the name in notes or do a "title" field
                // We'll do a special note for now:
                if (name) {
                    doc.notes.push({
                        time: new Date().toLocaleString(),
                        text: `Haven name: ${name}`
                    });
                }

                const result = await pinsCollection.insertOne(doc);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create safe haven' });
            }
        });

        // ---------------------------
        // FIRES
        // ---------------------------
        // GET /api/fires → find all pins where type = "Fire"
        app.get('/api/fires', async (req, res) => {
            try {
                const fires = await pinsCollection.find({ type: "Fire" }).toArray();
                res.json(fires);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to get fires' });
            }
        });

        // POST /api/fires → create a new "Fire" pin
        // expects { coords: [lng, lat] }
        app.post('/api/fires', async (req, res) => {
            try {
                const { coords } = req.body;
                if (!coords || coords.length !== 2) {
                    return res.status(400).json({ error: 'Invalid coords array' });
                }

                const doc = {
                    type: "Fire",
                    coords,
                    color: "#FF0000",
                    notes: [],
                    createdAt: new Date()
                };
                const result = await pinsCollection.insertOne(doc);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create fire point' });
            }
        });

        // ---------------------------
        // FLOODS (if you want)
        // ---------------------------
        // POST /api/floods → create a new "Flood" pin
        // expects { coords: [lng, lat] }
        app.post('/api/floods', async (req, res) => {
            try {
                const { coords } = req.body;
                if (!coords || coords.length !== 2) {
                    return res.status(400).json({ error: 'Invalid coords array' });
                }
                const doc = {
                    type: "Flood",
                    coords,
                    color: "#0000FF",
                    notes: [],
                    createdAt: new Date()
                };
                const result = await pinsCollection.insertOne(doc);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create flood point' });
            }
        });

        // GET /api/floods → find all pins where type = "Flood"
        app.get('/api/floods', async (req, res) => {
            try {
                const floods = await pinsCollection.find({ type: "Flood" }).toArray();
                res.json(floods);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to get floods' });
            }
        });

        // ---------------------------
        // EARTHQUAKES
        // ---------------------------
        app.get('/api/earthquakes', async (req, res) => {
            try {
                const eqs = await pinsCollection.find({ type: "Earthquake" }).toArray();
                res.json(eqs);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to get earthquakes' });
            }
        });

        app.post('/api/earthquakes', async (req, res) => {
            try {
                const { coords } = req.body;
                if (!coords || coords.length !== 2) {
                    return res.status(400).json({ error: 'Invalid coords array' });
                }
                const doc = {
                    type: "Earthquake",
                    coords,
                    color: "#8B4513", // brown
                    notes: [],
                    createdAt: new Date()
                };
                const result = await pinsCollection.insertOne(doc);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create earthquake point' });
            }
        });

        // ---------------------------
        // CUSTOM
        // ---------------------------
        app.get('/api/custom', async (req, res) => {
            try {
                const customs = await pinsCollection.find({ type: "Custom" }).toArray();
                res.json(customs);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to get custom pins' });
            }
        });

        // POST /api/custom → create a new "Custom" pin
        // expects { coords: [lng, lat], color: "#xxxxx", customType? }
        app.post('/api/custom', async (req, res) => {
            try {
                const { coords, color, customType } = req.body;
                if (!coords || coords.length !== 2) {
                    return res.status(400).json({ error: 'Invalid coords array' });
                }
                const doc = {
                    type: "Custom",
                    coords,
                    color: color || "#000000",
                    notes: [],
                    createdAt: new Date()
                };
                // If you want to store a "disasterType" note
                if (customType) {
                    doc.notes.push({
                        time: new Date().toLocaleString(),
                        text: `Custom Type: ${customType}`
                    });
                }

                const result = await pinsCollection.insertOne(doc);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create custom pin' });
            }
        });

        // ---------------------------
        // NOTES: add a note to any pin
        // e.g. POST /api/pins/:pinId/notes
        // body { text }
        // ---------------------------
        app.post('/api/pins/:pinId/notes', async (req, res) => {
            try {
                const pinId = req.params.pinId;
                const { text } = req.body;
                if (!text) {
                    return res.status(400).json({ error: 'Note text is required' });
                }

                // We'll push into the "notes" array
                const noteObj = {
                    _id: new ObjectId(),
                    time: new Date().toLocaleString(),
                    text
                };

                const result = await pinsCollection.findOneAndUpdate(
                    { _id: new ObjectId(pinId) },
                    { $push: { notes: noteObj } },
                    { returnDocument: 'after' }
                );

                if (!result.value) {
                    return res.status(404).json({ error: 'Pin not found' });
                }
                // Return the updated doc
                res.json(result.value);
            } catch (err) {
                console.error('Error adding note:', err);
                res.status(500).json({ error: 'Failed to add note' });
            }
        });

        // 6) Listen on a port
        const PORT = process.env.PORT || 5001; // fallback to 5001 or from .env
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB Atlas:", err);
    }
}

// 7) Start the server
startServer();
