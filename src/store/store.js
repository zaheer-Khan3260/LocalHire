import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import conversationSlice from "./ConversationSlice.js";
import { saveStateToLocalStorage, loadStateFromLocalStorage} from "../utils/cookieStorage.js"

// Load the state from cookies or localStorage
const preloadedState = loadStateFromLocalStorage() || {}; // Use an empty object if no state is found

const store = configureStore({
    reducer: {
        auth: authSlice,
        conversation: conversationSlice,
    },
    preloadedState, // Set the preloaded state
});

// Save the state to cookies before the page unloads
window.addEventListener("beforeunload", () => {
    saveStateToLocalStorage(store.getState());
});

// Subscribe to store updates to save state on every change
store.subscribe(() => {
    saveStateToLocalStorage(store.getState());
});

export { store };
