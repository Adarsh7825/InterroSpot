const express = require('express');
const router = express.Router();
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');
const { uploadImage, getImages, uploadImageforInterviewer } = require('../controllers/CaptureImageUploadController')

router.post('/uploadImage/:roomId', uploadImage);
router.post('/uploadImageforInterviewer/:roomId', uploadImageforInterviewer);
router.get('/fetchImage/:roomId', getImages);

module.exports = router;