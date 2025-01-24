// controllers/pinController.js
const PinModel = require('../models/pinModel');

/**
 * Create a new pin (lng, lat, note, etc.).
 */
async function createPin(req, res) {
    try {
        // Log the raw body for debugging:
        console.log('Received createPin request body:', req.body);

        let { lng, lat, note } = req.body;

        // If lat/lng might be strings, parse them:
        lng = parseFloat(lng);
        lat = parseFloat(lat);

        // Check if they are valid numbers
        if (Number.isNaN(lng) || Number.isNaN(lat)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        // Now we know lat/lng are actual numbers:
        const newPinId = await PinModel.createPin({
            lng,
            lat,
            note: note || ''
        });

        console.log('New pin created with _id:', newPinId);

        return res.status(201).json({ _id: newPinId, lng, lat, note });
    } catch (err) {
        console.error('Error creating pin:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Get all pins (including their comments).
 */
async function getAllPins(req, res) {
    try {
        const pins = await PinModel.findAll();
        return res.json(pins);
    } catch (err) {
        console.error('Error getting pins:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Add a comment to a specific pin.
 */
async function addCommentToPin(req, res) {
    try {
        const pinId = req.params.pinId;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const updatedPin = await PinModel.addComment(pinId, text);
        if (!updatedPin) {
            return res.status(404).json({ error: 'Pin not found' });
        }
        return res.json(updatedPin);
    } catch (err) {
        console.error('Error adding comment:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    createPin,
    getAllPins,
    addCommentToPin
};
