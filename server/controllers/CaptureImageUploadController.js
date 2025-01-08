const Room = require('../DB/Schema/room');
const { uploadImageToCloudinary, deleteFromCloudinary } = require('../utils/imageUploader');
const fs = require('fs');
const mongoose = require('mongoose');

exports.uploadImage = async (req, res) => {
    try {
        console.log('Files:', req.files);
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

        // Find the room first to get the existing image URL
        const existingRoom = await Room.findOne({ roomid: roomId });
        if (!existingRoom) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        // If there's an existing image, delete it from Cloudinary
        if (existingRoom.imageUrl) {
            const publicId = getPublicIdFromUrl(existingRoom.imageUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }

        // Dynamically import tempfile
        const { default: tempfile } = await import('tempfile');

        // Create a temporary file path
        const tempFilePath = tempfile({ extension: '.jpg' });
        fs.writeFileSync(tempFilePath, imageFile.data);

        const image = await uploadImageToCloudinary(tempFilePath, 'room_images', 1000, 1000);

        // Update the room with new image URL
        const room = await Room.findOneAndUpdate(
            { roomid: roomId },
            { imageUrl: image.secure_url },
            { new: true }
        );

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

        res.status(200).json({ success: true, room });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadImageforInterviewer = async (req, res) => {
    try {
        console.log('Files:', req.files);
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

        // Find the room first to get the existing image URL
        const existingRoom = await Room.findOne({ roomid: roomId });
        if (!existingRoom) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        // If there's an existing image, delete it from Cloudinary
        if (existingRoom.imageUrlforInterviewer) {
            const publicId = getPublicIdFromUrl(existingRoom.imageUrlforInterviewer);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }

        // Dynamically import tempfile  
        const { default: tempfile } = await import('tempfile');

        // Create a temporary file path
        const tempFilePath = tempfile({ extension: '.jpg' });
        fs.writeFileSync(tempFilePath, imageFile.data);

        const image = await uploadImageToCloudinary(tempFilePath, 'room_images', 1000, 1000);

        // Update the room with new image URL
        const room = await Room.findOneAndUpdate(
            { roomid: roomId },
            { imageUrlforInterviewer: image.secure_url },
            { new: true }
        );

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

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

// Helper function to extract public_id from Cloudinary URL
function getPublicIdFromUrl(url) {
    try {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split('.')[0];
        return `room_images/${publicId}`;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
}