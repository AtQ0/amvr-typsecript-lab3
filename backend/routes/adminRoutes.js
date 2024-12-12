const {
  getUsers,
  getUser,
  modifyUser,
  getUserAddress,
  deleteUser,
  getUserByEmail, // Add this to the list of imports
} = require('../repositories/adminController');
const express = require('express');

const routes = express.Router();

routes.get('/', getUsers);
routes.get('/get-user/:id', getUser);
routes.put('/modify-user/:id', modifyUser);
routes.get('/get-user-address/:id', getUserAddress);
routes.delete('/delete-user/:id', deleteUser);
routes.get('/get-user-by-email', getUserByEmail);

module.exports = routes;
