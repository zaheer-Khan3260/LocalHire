import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    messageData: null
}

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        sendMessages: (state, action) => {
            state.status = true;
            state.messageData = action.payload.messageData;
        },

        endMessages: (state) => {
            state.status = false;
            state.messageData = null
        }
    }
})

export const {sendMessages, endMessages} = messageSlice.actions;

export default messageSlice.reducer