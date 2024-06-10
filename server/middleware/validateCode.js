const supportedLanguages = ['c_cpp', 'java', 'python', 'nodejs', 'golang', 'csharp', 'rust', 'kotlin', 'scala', 'swift', 'ruby', 'perl', 'haskell', 'bash', 'r', 'lua', 'php', 'typescript', 'coffeescript', 'clojure', 'groovy', 'fsharp', 'd', 'elixir', 'nim', 'erlang', 'crystal', 'cobol', 'fortran', 'julia', 'scheme', 'ocaml', 'pascal', 'racket', 'smalltalk', 'tcl', 'visualbasic'];

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
        if (!supportedLanguages.includes(language)) {
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