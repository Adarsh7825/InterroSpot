import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice";
import roomReducer from "../slices/roomSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    room: roomReducer,
})

export default rootReducer