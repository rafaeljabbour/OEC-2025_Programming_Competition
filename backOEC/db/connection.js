// db/connection.js
require('dotenv').config(); // Load .env file
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
// Updated (for MongoDB driver 4.x+)
const client = new MongoClient(uri);

let db = null;

/**
 * Connect to the database (singleton).
 * Returns the same db instance each time it's called.
 */
async function connect() {
    if (!db) {
        await client.connect();
        console.log('Connected to MongoDB Atlas!');
        db = client.db(process.env.DB_NAME1 || 'Data'); // fallback "Data" if DB_NAME not set
    }
    return db;
}

module.exports = {
    connect,
    client
};
