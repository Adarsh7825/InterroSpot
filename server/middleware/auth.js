const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../DB/Schema/user')

exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization").replace("Bearer ", "");

        //if token missing, then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch (err) {
            //verification - issue
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
        });
    }
}

module.exports.isCandidate = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'candidate') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this route',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this route',
        });
    }
};

module.exports.isInterviewer = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'interviewer') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this route',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this route',
        });
    }
};

module.exports.isRecruiter = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'recruiter') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this route',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this route',
        });
    }
};

module.exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this route',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this route',
        });
    }
};