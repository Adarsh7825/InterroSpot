const axios = require('axios');
require('dotenv').config();

const url = "https://api.jdoodle.com/v1/execute";
const languageMap = {
    java: {
        name: "java",
        version: 4,
    },
    python: {
        name: "python3",
        version: 4,
    },
    c_cpp: {
        name: "cpp17",
        version: 0,
    },
    golang: {
        name: "go",
        version: 4,
    },
    csharp: {
        name: "csharp",
        version: 4,
    },
    javascript: {
        name: "nodejs",
        version: 4,
    },
    rust: {
        name: "rust",
        version: 4,
    }
};

exports.execute = async (req, res) => {
    try {
        let { code, language } = req.body;
        const stdin = req.body.input || "";
        console.log('Received Code:', code);
        console.log('Received Language:', language);
        console.log('Received Input:', stdin);

        language = languageMap[language];
        if (!language) {
            return res.status(400).send({ message: "Unsupported language" });
        }
        console.log('Mapped Language:', language);

        const data = {
            script: code,
            language: language.name,
            versionIndex: language.version,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            stdin: stdin,
        };
        console.log('Request Data:', data);

        const response = await axios.post(url, data);
        console.log('Response Data:', response.data);

        return res.status(200).send(response.data);
    } catch (error) {
        console.error('Error in code execution:', error.stack);
        return res.status(500).send({ error: error.message });
    }
};