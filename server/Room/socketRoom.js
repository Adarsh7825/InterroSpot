const diff = require('diff-match-patch');
const dmp = new diff.diff_match_patch();
let rooms = {};

function createRoom(roomid, code, language, input, output) {
    if (!rooms[roomid]) {
        rooms[roomid] = {
            code,
            language,
            input,
            output,
            users: []
        };
    }
}

function deleteRoom(roomid) {
    console.log("Deleting room", roomid);
    if (rooms[roomid]) {
        delete rooms[roomid];
    }
}

function addRoomUser(roomid, user) {
    if (rooms[roomid]) {
        rooms[roomid].users.push(user);
    }
}

function removeRoomUser(roomid, userId) {
    let userName;
    if (rooms[roomid]) {
        rooms[roomid].users = rooms[roomid].users.filter(user => {
            if (user.id === userId) {
                userName = user.name;
                return false;
            }
            return true;
        });
        // Optionally delete the room if no users are left
        // if (rooms[roomid].users.length === 0) {
        //     deleteRoom(roomid);
        // }
    }
    return userName;
}

function updateRoom(roomid, patch) {
    if (rooms[roomid]) {
        try {
            const code = rooms[roomid].code;
            const [newCode, result] = dmp.patch_apply(patch, code);
            if (result[0]) {
                rooms[roomid].code = newCode;
                console.log(`Patch applied successfully for room ${roomid}. New code: ${newCode}`);
            } else {
                console.log("Patch failed", result);
            }
        } catch (error) {
            console.log("Error in patching", error);
        }
    }
}
function getRoom(roomid) {
    return rooms[roomid] ? rooms[roomid] : null;
}

function updateRoomInputOutput(roomid, input = '', output = '', language = '') {
    if (rooms[roomid]) {
        try {
            rooms[roomid].input = input;
            rooms[roomid].output = output;
            rooms[roomid].language = language;
        } catch (error) {
            console.log("Error in updating input output", rooms[roomid]);
        }
    }
}

module.exports = {
    createRoom,
    deleteRoom,
    addRoomUser,
    removeRoomUser,
    updateRoom,
    getRoom,
    updateRoomInputOutput
};