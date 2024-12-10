const {
  getProfile,
  editProfile,
  deleteProfile,
} = require('../repositories/profile');

const express = require('express');

const profileRoutes = express.Router();

profileRoutes.get('/', getProfile);
profileRoutes.put('/edit-profile', editProfile);
profileRoutes.delete('/delete-profile', deleteProfile);

module.exports = profileRoutes;
// Ryan
