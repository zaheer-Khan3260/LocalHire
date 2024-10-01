import Cookies from 'js-cookie';

// Helper functions to encode and decode state
const encodeState = (state) => {
    try {
        return btoa(encodeURIComponent(JSON.stringify(state)));
    } catch (e) {
        console.error("Failed to encode state:", e);
        return null;
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

export const saveState = (state) => {
    const encodedState = encodeState(state);
    if (encodedState) {
        Cookies.set('reduxState', encodedState, { expires: 1 }); // Expires in 1 day
    }
};

export const loadState = () => {
    const encodedState = Cookies.get('reduxState');
    return encodedState ? decodeState(encodedState) : undefined;
};
