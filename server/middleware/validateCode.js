const supportedLanguage = ['c_cpp', 'java', 'python', 'nodejs', 'golang', 'csharp', 'rust']

const validateCode = async (req, res, next) => {
    try {
        let { code, language } = req.body;
        language = language.trim().toLowerCase();
        if (language === 'javascript') {
            language = 'nodejs';
        }
        if (!code || !language) {
            return res.status(400).send({ message: "Bad Request" });
        }
        if (!supportedLanguage.includes(language)) {
            return res.status(400).send({ message: "Language not supported" });
        }
        req.body.language = language;
        console.log('Validated Language:', language); // Add this line
        next();
    } catch (error) {
        console.log("error in code execution");
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = validateCode;