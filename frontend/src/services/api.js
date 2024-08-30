import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import store from '../app/store'; // Import your Redux store to dispatch actions
import { logout } from '../features/auth/authSlice'; // Import the logout action from your auth slice

// Create an Axios instance
const API = axios.create({ baseURL: 'http://localhost:5001/api' });

// Request interceptor to add token to headers
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Response interceptor to handle expired tokens
API.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Token expired. Redirecting to login...');

            // Dispatch logout action to clear the auth state and token
            store.dispatch(logout()); // Clear Redux state
            localStorage.removeItem('token'); // Clear token from localStorage

            // Use navigate function from react-router-dom to redirect to login
            const navigate = useNavigate();
            navigate('/login');

            // Optionally, you can also return a rejected promise to halt the failed request
            return Promise.reject(error);
        }
        return Promise.reject(error); // If not a 401, just reject the promise
    }
);

export default API;