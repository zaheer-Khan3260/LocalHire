import axios from "axios";

export const api = axios.create({
    // baseURL: "https://free-ap-south-1.cosmocloud.io/development",
    headers: {
        projectid: import.meta.env.VITE_COSMOCLOUD_PROJECT_ID,
        environmentid: import.meta.env.VITE_COSMOCLOUD_ENVIRONMENT_ID
    },
    withCredentials: true
});
