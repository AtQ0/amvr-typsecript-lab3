const express = require('express');
const { createNewUser } = require('../repositories/registerController');

const routes = express.Router();

// Define the POST route for creating a new user
routes.post('/', createNewUser);

module.exports = routes;
