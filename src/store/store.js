import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { saveState, loadState } from "../utils/cookieStorage.js"; // Ensure the path is correct

// Load the state from cookies
const preloadedState = loadState();

const store = configureStore({
    reducer: {
        auth: authSlice,
    },
    preloadedState, // Set the preloaded state
});

// Save the state to cookies before the page unloads
window.addEventListener("beforeunload", () => {
    saveState(store.getState());
});

export { store };