const randomString = require('randomstring');
const Codes = require('../utils/constants/default_code.json');

const roomData = async (req, res, next) => {
    try {
        const name = req.body.name;
        const roomid = randomString.generate(6);
        const language = req.user.editor.language;
        const code = Codes[language].snippet;
        const owner = req.user._id;
        const room = { name, roomid, language, code, owner };
        req.room = room;
        next();
    } catch (error) {
        console.log('error in roomData middleware');
        return res.status(500).send({ error: error });
    }
};


// const roomData = async (req, res, next) => {
//     try {
//         const name = req.body.name;
//         const roomid = randomString.generate(6);
//         // Temporarily hardcode values for testing
//         const language = "javascript"; // Example hardcoded value
//         const code = Codes[language].snippet;
//         const owner = "663b97820a878f407793cdf2"; // Example hardcoded value
//         const room = { name, roomid, language, code, owner };
//         req.room = room;
//         next();
//     } catch (error) {
//         console.log('error in roomData middleware');
//         return res.status(500).send({ error: error.toString() });
//     }
// };

module.exports = roomData;