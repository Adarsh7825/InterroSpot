const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../DB/Schema/user');

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookeis.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is misisng',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(401).json({
                success: false,
                message: 'Please authenticate',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Something went wrong while validating the token',
            });
        }
    }
};

exports.isCandidate = async (req, res, next) => {
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

exports.isInterviewer = async (req, res, next) => {
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

exports.isRecruiter = async (req, res, next) => {
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

exports.isAdmin = async (req, res, next) => {
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