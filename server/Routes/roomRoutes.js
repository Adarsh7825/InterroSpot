// In your roomRoutes.js file
const express = require('express');
const roomRouter = new express.Router();
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');
const roomData = require('../middleware/roomData');
const { createRoom, deleteRoom, fetch, updateRoom } = require('../controllers/roomCtrl')
// Use the middleware
roomRouter.post('/create', auth, roomData, createRoom);
roomRouter.get('/fetch', auth, isAdmin, isInterviewer, isRecruiter, fetch);
roomRouter.patch('/update', auth, isAdmin, isInterviewer, isRecruiter, updateRoom);
roomRouter.delete('/delete', auth, isAdmin, isInterviewer, isRecruiter, deleteRoom);

module.exports = roomRouter;