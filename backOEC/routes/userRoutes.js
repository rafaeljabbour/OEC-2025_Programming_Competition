// routes/userRoutes.js
const express = require('express');

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    searchUsers
} = require('../controllers/userController');

module.exports = function userRoutes() {
    const router = express.Router();

    // GET all users
    router.get('/', getUsers);

    // GET one user by ID
    router.get('/:id', getUserById);

    // POST new user
    router.post('/', createUser);

    // POST login user
    router.post('/login', loginUser);

    // PUT (update) user
    router.put('/:id', updateUser);

    // DELETE user
    router.delete('/:id', deleteUser);

    // GET search users
    router.get('/search', searchUsers);

    return router;
};
