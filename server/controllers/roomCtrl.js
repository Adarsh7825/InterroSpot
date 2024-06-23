const Room = require('../DB/Schema/room');
const User = require('../DB/Schema/user');
const InterviewSession = require('../DB/Schema/InterviewSessionSchema');
const baseURL = process.env.BASE_URL;
const cloudinary = require('cloudinary').v2;


// Method for creating a room
exports.createRoom = async (req, res) => {
    try {
        const room = new Room(req.room);
        await room.save();
        const user = await User.findById(req?.user.id);
        if (!user) {
            throw new Error('User not found');
        }
        user.rooms.push(room._id);
        await user.save();
        const roomLink = baseURL + room.roomid;
        return res.status(200).send({
            room,
            message: 'Room created successfully',
            link: roomLink
        });
    } catch (error) {
        console.error('error in create room', error);
        return res.status(500).send({
            error: error.message || 'An unknown error occurred'
        });
    }
};
// Method for fetching a room
exports.fetch = async (req, res) => {
    try {
        const roomid = (req.query.id);
        const room = await Room.findOne({ roomid });
        if (!room) return res.status(404).send({ error: 'Room not found' });
    } catch (error) {
        console.log('error in fetch room');
        return res.status(400).send('failed to fetch room details')
    }
};

// Method for updating a room
exports.updateRoom = async (req, res) => {
    try {
        const roomid = req.body.room.roomid;
        const room = await Room.findOneAndUpdate({
            roomid
        }, {
            name: req.body.room.name || "",
            code: req.body.room.code || "",
            language: req.body.room.language || "plaintext"
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).send(room);
    } catch (error) {
        console.log('error in update room', error);
        return res.status(500).send({ error: error });
    }
};

// Method for deleting a room
exports.deleteRoom = async (req, res) => {
    try {
        const _id = req.query.id;
        const room = await Room.findByIdAndDelete(_id);
        if (!room) return res.status(404).send({ error: 'Room not found to delete' });
        return res.status(200).send({ message: 'Room deleted successfully' });
    } catch (error) {
        console.log('error in delete room');
        res.status(400).send({ error: 'failed to delete room' });
    }
};

// Method for uploading an image 
const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, { upload_preset: 'ml_default' }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url);
            }
        });
    });
};

exports.uploadImageController = async (req, res) => {
    try {
        console.log('File:', req.file);
        console.log('Body:', req.body);

        const { roomId } = req.body;
        const file = req.file; // Assuming you are using multer to handle file uploads

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = await uploadImage(file);

        // Update the session with the image URL
        await InterviewSession.findByIdAndUpdate(roomId, { imageUrl });

        return res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Error uploading image', error });
    }
};