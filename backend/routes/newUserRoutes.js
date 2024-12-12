const express = require('express');
const { createNewUser, getUserById } = require('../repositories/registerController');

const routes = express.Router();

// POST route to create a new user
routes.post('/', createNewUser);

// GET route to fetch user by ID for verification
routes.get('/:id', getUserById);  // Route to verify the created user by ID

module.exports = routes;
