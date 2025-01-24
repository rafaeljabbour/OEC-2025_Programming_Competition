// models/userModel.js
const { connect } = require('../db/connection');
const { ObjectId } = require('mongodb');

class UserModel {
    /**
     * Initializes the "users" collection with helpful indexes.
     */
    static async initializeCollection() {
        try {
            const db = await connect();
            const collection = db.collection('users');

            // Example: Ensure "email" is unique
            // Adjust { unique: false } if you don't want actual uniqueness
            await collection.createIndex({ email: 1 }, { unique: true });

            console.log('User collection initialized (indexes created).');
        } catch (err) {
            console.error('Error initializing user collection:', err);
        }
    }

    /**
     * Retrieves an array of all users in the database.
     * @returns {Promise<Array>} Array of user documents.
     */
    static async findAll() {
        try {
            const db = await connect();
            return db.collection('users').find({}).toArray();
        } catch (err) {
            console.error('Error in findAll:', err);
            throw err; // rethrow for upstream handling
        }
    }

    /**
     * Finds a user by their MongoDB _id.
     * @param {string} id - The user's ObjectId as a string.
     * @returns {Promise<Object|null>} The user document or null if not found.
     */
    static async findById(id) {
        try {
            const db = await connect();
            return db.collection('users').findOne({ _id: new ObjectId(id) });
        } catch (err) {
            console.error('Error in findById:', err);
            throw err;
        }
    }

    /**
     * Finds a user by their email address.
     * @param {string} email
     * @returns {Promise<Object|null>} The user document or null if not found.
     */
    static async findByEmail(email) {
        try {
            const db = await connect();
            return db.collection('users').findOne({ email });
        } catch (err) {
            console.error('Error in findByEmail:', err);
            throw err;
        }
    }

    /**
     * Inserts a new user document into the collection.
     * @param {Object} userData - The user object to store.
     * @returns {Promise<string>} The newly created user's _id.
     */
    static async createUser(userData) {
        try {
            const db = await connect();
            const result = await db.collection('users').insertOne(userData);
            return result.insertedId.toString(); // convert ObjectId to string
        } catch (err) {
            console.error('Error in createUser:', err);
            throw err;
        }
    }

    /**
     * Updates a user by ID, returning the updated document.
     * @param {string} id - The user's ObjectId as a string.
     * @param {Object} updateData - Fields to update.
     * @returns {Promise<Object|null>} The updated user document or null if not found.
     */
    static async updateUser(id, updateData) {
        try {
            const db = await connect();
            // Use "findOneAndUpdate" to get the updated doc in a single operation
            const result = await db.collection('users').findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' } // or use { returnOriginal: false } in older driver versions
            );
            // result.value is the updated doc, or null if no match
            return result.value;
        } catch (err) {
            console.error('Error in updateUser:', err);
            throw err;
        }
    }

    /**
     * Deletes a user by their ID.
     * @param {string} id - The user's ObjectId as a string.
     * @returns {Promise<number>} The number of documents deleted (0 or 1).
     */
    static async deleteUser(id) {
        try {
            const db = await connect();
            const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount;
        } catch (err) {
            console.error('Error in deleteUser:', err);
            throw err;
        }
    }

    /**
     * Searches for users by a query string.
     * @param {string} query - The search query.
     * @returns {Promise<Array>} Array of user documents matching the query.
     */
    static async searchByQuery(query) {
        try {
            const db = await connect();
            return db.collection('users').find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            }).toArray();
        } catch (err) {
            console.error('Error in searchByQuery:', err);
            throw err;
        }
    }
}

module.exports = UserModel;
