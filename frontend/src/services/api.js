import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: '/api', // This assumes we will set up a proxy in Vite, or we use relative paths
    withCredentials: true, // Important for session cookies to be sent back and forth
});

// Interceptor for responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If we get a 401 Unauthorized, we can handle it globally here
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized access - please log in');
            // We could dispatch an event or handle it in the Context
        }
        return Promise.reject(error);
    }
);

export default api;
