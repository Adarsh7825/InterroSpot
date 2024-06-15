const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);

const url = process.env.MONGODB_URI;

const dbConnect = async () => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
        console.log("DB connection error", error);
    }
};

module.exports = dbConnect;