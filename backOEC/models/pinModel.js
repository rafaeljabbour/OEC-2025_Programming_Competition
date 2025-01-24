// models/pinModel.js
const { connectPins } = require('../db/connectionPins');
const { ObjectId } = require('mongodb');

class PinModel {
    static async initializeCollection() {
        try {
            const db = await connectPins();
            const collection = db.collection('pins');
            await collection.createIndex({ createdAt: 1 });
            console.log('Pins collection initialized (indexes created).');
        } catch (err) {
            console.error('Error initializing pins collection:', err);
        }
    }

    static async createPin(pinData) {
        try {
            const db = await connectPins();
            const result = await db.collection('pins').insertOne({
                ...pinData,
                comments: pinData.comments || [],
                createdAt: new Date()
            });
            return result.insertedId.toString();
        } catch (err) {
            console.error('Error in createPin:', err);
            throw err;
        }
    }

    static async findAll() {
        try {
            const db = await connectPins();
            return db.collection('pins').find({}).toArray();
        } catch (err) {
            console.error('Error in findAll (pins):', err);
            throw err;
        }
    }

    static async findById(pinId) {
        try {
            const db = await connectPins();
            return db.collection('pins').findOne({ _id: new ObjectId(pinId) });
        } catch (err) {
            console.error('Error in findById (pin):', err);
            throw err;
        }
    }

    static async addComment(pinId, commentText) {
        try {
            const db = await connectPins();
            const commentObj = {
                _id: new ObjectId(),
                text: commentText,
                createdAt: new Date()
            };

            const result = await db.collection('pins').findOneAndUpdate(
                { _id: new ObjectId(pinId) },
                { $push: { comments: commentObj } },
                { returnDocument: 'after' }
            );
            return result.value; // the updated pin doc
        } catch (err) {
            console.error('Error in addComment (pin):', err);
            throw err;
        }
    }
}

module.exports = PinModel;
