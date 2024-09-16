import axios from "axios";

export const api = axios.create({
    headers: {
        projectid: process.env.COSMOCLOUD_PROJECT_ID,
        environmentid: process.env.COSMOCLOUD_ENVIRONMENT_ID
    },
})