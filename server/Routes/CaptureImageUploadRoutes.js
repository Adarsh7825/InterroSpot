const express = require('express');
const router = express.Router();
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');
const { uploadImage, getImages } = require('../controllers/CaptureImageUploadController')

router.post('/uploadImage/:roomId', uploadImage);
router.get('/fetchImage/:roomId', getImages);

module.exports = router;