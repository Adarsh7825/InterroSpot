import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    room: null,
    loading: false,
};

const roomSlice = createSlice({
    name: "room",
    initialState: initialState,
    reducers: {
        setRoom(state, action) {
            state.room = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setRoom, setLoading } = roomSlice.actions;
export default roomSlice.reducer;
