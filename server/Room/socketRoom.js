const diff = require('diff-match-patch');
const dmp = new diff.diff_match_patch();
let room = {};

function createRoom(roomid, roomName, code, language, input, output) {
    if (!room[roomid]) {
        room[roomid] = {
            roomName,
            code,
            language,
            input,
            output,
            users: []
        }
    }
}


function deleteRoom(roomid) {
    console.log("Deleting room", roomid);
    if (room[roomid]) {
        delete room[roomid];
    }
}

function addRoomUser(roomid, user) {
    if (room[roomid]) {
        room[roomid].users.push(user);
    }
}

function removeRoomUser(roomid, userId) {
    let userName;
    if (room[roomid]) {
        room[roomid].users = room[roomid].users.filter(user => {
            if (user.userId === userId) {
                userName = user.userName;
                return false;
            }
            return true;
        });
    }
    if (room[roomid].users.length === 0) {
        deleteRoom(roomid);
    }
    return userName;
}

function updateRoom(roomid, code) {
    if (room[roomid]) {
        try {
            const code = room[roomid].code;
            const [newCode, result] = dmp.patch_apply(patch, code);
            if (result[0]) {
                room[roomid].code = newCode;
            } else {
                console.log("Patch failed", result);
            }
        } catch (error) {
            console.log("Error in patching", error);
        }
    }
}

function getRoom(roomid) {
    return room[roomid] ? room[roomid] : null;
}

function updateRoomInputOutput(roomid, input = '', output = '', language = '') {
    if (room[roomid]) {
        try {
            room[roomid].input = input;
            room[roomid].output = output;
            room[roomid].language = language;
        } catch (error) {
            console.log("Error in updating input output", room[roomid]);
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
}