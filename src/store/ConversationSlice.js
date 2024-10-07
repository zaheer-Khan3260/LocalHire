import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        add: (state, action) => {
            state.status = true;
            state.id = action.payload;
        },

        remove: (state) => {
            state.status = false;
            state.id = null;
        }
    }
})

export const {add, remove} = conversationSlice.actions;

export default conversationSlice.reducer;