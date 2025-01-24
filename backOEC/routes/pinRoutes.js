// routes/pinRoutes.js
const express = require('express');
const {
    createPin,
    getAllPins,
    addCommentToPin
} = require('../controllers/pinController');

const router = express.Router();

// GET all pins
router.get('/', getAllPins);

// POST create a pin
router.post('/', createPin);

// POST add a comment to a pin
router.post('/:pinId/comments', addCommentToPin);

module.exports = router;
