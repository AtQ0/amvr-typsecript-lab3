const { checkAuth } = require('../repositories/authController')

const express = require('express');

const routes = express.Router();

// Define the POST route for authentication
routes.post('/', checkAuth);


module.exports = routes;
