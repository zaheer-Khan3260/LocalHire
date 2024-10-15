import Cookies from 'js-cookie';

// Helper functions to encode and decode state
const encodeState = (state) => {
    try {
        return btoa(encodeURIComponent(JSON.stringify(state)));
    } catch (e) {
        console.error("Failed to encode state:", e);
        throw new Error("Encoding error");
    }
};

const decodeState = (encodedState) => {
    try {
        return JSON.parse(decodeURIComponent(atob(encodedState)));
    } catch (e) {
        console.error("Failed to decode state:", e);
        return undefined;
    }
};

const isStateTooLarge = (state) => {
    const encodedState = encodeURIComponent(JSON.stringify(state));
    return encodedState.length > 4096; // Approximate cookie size limit
};

export const saveState = (state, options = { expires: 1, path: '/' }) => {
    const encodedState = encodeURIComponent(JSON.stringify(state));
    console.log("State size:", encodedState.length);

    if (isStateTooLarge(state)) {
        console.error("State is too large to be saved in cookies. Saving to localStorage instead.");
        saveStateToLocalStorage(state); // Fallback to localStorage
        return;
    }
    
    const encodedStateToSave = encodeState(state); // Renamed variable
    if (encodedStateToSave) {
        Cookies.set('reduxState', encodedStateToSave, { expires: options.expires, path: options.path });
    }
};

export const loadState = () => {
    const encodedState = Cookies.get('reduxState');
    return encodedState ? decodeState(encodedState) : loadStateFromLocalStorage(); // Fallback to localStorage
};

// Local Storage functions with encoding/decoding
export const saveStateToLocalStorage = (state) => {
    try {
        const encodedState = encodeState(state); // Encode before saving
        localStorage.setItem('reduxState', encodedState);
    } catch (e) {
        console.error("Failed to save state to localStorage:", e);
    }
};

export const loadStateFromLocalStorage = () => {
    try {
        const encodedState = localStorage.getItem('reduxState');
        return encodedState ? decodeState(encodedState) : undefined; // Decode when loading
    } catch (e) {
        console.error("Failed to load state from localStorage:", e);
        return undefined;
    }
};
