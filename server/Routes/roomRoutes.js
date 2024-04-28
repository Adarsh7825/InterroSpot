// In your roomRoutes.js file
const express = require('express');
const roomRouter = new express.Router();
const { auth } = require('../middleware/auth'); // Destructure if exported as an object
const roomData = require('../middleware/roomData');
const url = require('../utils/constants/appConstants');
const roomCtrl = require('../controllers/roomCtrl');

// Use the middleware
roomRouter.post(url.ROOMS.CREATE, auth, roomData, roomCtrl.createRoom);
roomRouter.get(url.ROOMS.FETCH, auth, roomCtrl.fetch);
roomRouter.patch(url.ROOMS.UPDATE, auth, roomCtrl.updateRoom);
roomRouter.delete(url.ROOMS.DELETE, auth, roomCtrl.deleteRoom);

module.exports = roomRouter;