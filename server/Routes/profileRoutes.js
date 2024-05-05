const express = require("express")
const router = express.Router()
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth')
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
} = require("../controllers/ProfileController")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router