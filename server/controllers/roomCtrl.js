const Room = require('../DB/Schema/room');
const User = require('../DB/Schema/user');

// Method for creating a room
exports.createRoom = async (req, res) => {
    try {
        const room = new Room(req.room);
        await room.save();
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new Error('User not found');
        }
        user.rooms.push(room._id);
        await user.save();
        return res.status(200).send({
            room,
            message: 'Room created successfully'
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