const Room = require('../DB/Schema/room');

async function createRoom(req, res) {
    try {
        const room = new Room(req.body);
        await room.save();

        res.status(200).send(room);

    } catch (error) {
        console.log('error in createRoom');
    }
}