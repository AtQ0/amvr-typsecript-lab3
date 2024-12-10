const express = require('express');
const getTest = require('../repositories/test');

const testRoutes = express.Router();

testRoutes.get('/test', getTest);

module.exports = testRoutes;
