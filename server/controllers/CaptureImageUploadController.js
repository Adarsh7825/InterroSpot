const Room = require('../DB/Schema/room');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const fs = require('fs');
const mongoose = require('mongoose');

exports.uploadImage = async (req, res) => {
    try {
        console.log('Files:', req.files); // Log the files to debug
        const { roomId } = req.params;
        const imageFile = req.files ? req.files.imageUrl : null;

        if (!imageFile) {
            console.log('No image file uploaded');
            return res.status(400).json({ success: false, message: 'No image file uploaded' });
        }

        // Validate roomId
        if (!roomId) {
            console.log('Invalid room ID');
            return res.status(400).json({ success: false, message: 'Invalid room ID' });
        }

        // Dynamically import tempfile
        const { default: tempfile } = await import('tempfile');

        // Create a temporary file path with the new API
        const tempFilePath = tempfile({ extension: '.jpg' });
        fs.writeFileSync(tempFilePath, imageFile.data);

        const image = await uploadImageToCloudinary(tempFilePath, 'room_images', 1000, 1000);

        // Find the room by roomid and update the imageUrl
        const room = await Room.findOneAndUpdate({ roomid: roomId }, { imageUrl: image.secure_url }, { new: true });

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

        if (!room) {
            console.log('Room not found');
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        res.status(200).json({ success: true, room });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadImageforInterviewer = async (req, res) => {
    try {
        console.log('Files:', req.files); // Log the files to debug
        const { roomId } = req.params;
        const imageFile = req.files ? req.files.imageUrl : null;

        if (!imageFile) {
            console.log('No image file uploaded');
            return res.status(400).json({ success: false, message: 'No image file uploaded' });
        }

        // Validate roomId
        if (!roomId) {
            console.log('Invalid room ID');
            return res.status(400).json({ success: false, message: 'Invalid room ID' });
        }

        // Dynamically import tempfile
        const { default: tempfile } = await import('tempfile');

        // Create a temporary file path with the new API
        const tempFilePath = tempfile({ extension: '.jpg' });
        fs.writeFileSync(tempFilePath, imageFile.data);

        const image = await uploadImageToCloudinary(tempFilePath, 'room_images', 1000, 1000);

        // Find the room by roomid and update the imageUrl
        const room = await Room.findOneAndUpdate({ roomid: roomId }, { imageUrlforInterviewer: image.secure_url }, { new: true });

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

        if (!room) {
            console.log('Room not found');
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        res.status(200).json({ success: true, room });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getImages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ roomid: roomId });

        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        // only send image URL if it exists
        const roomData = room.toJSON();
        if (!roomData.imageUrl) {
            console.log('No image URL');
        }
        res.status(200).json({ success: true, room: roomData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};