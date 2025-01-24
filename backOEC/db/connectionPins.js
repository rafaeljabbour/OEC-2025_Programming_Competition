// db/connectionPins.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const clientPins = new MongoClient(uri);

let dbPins = null;

/**
 * Connect to the second DB (DB_NAME2) for pins.
 */
async function connectPins() {
    if (!dbPins) {
        await clientPins.connect();
        console.log('Connected to MongoDB Atlas (Pins DB)!');
        const dbName2 = process.env.DB_NAME2 || 'PinsDB';
        console.log('Using DB_NAME2:', dbName2);

        dbPins = clientPins.db(dbName2);
    }
    return dbPins;
}

module.exports = {
    connectPins,
    clientPins
};
