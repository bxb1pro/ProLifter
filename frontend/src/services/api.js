import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import store from '../app/store'; // Import Redux store
import { logout } from '../features/auth/authSlice';

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
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Token expired. Redirecting to login...');

            // Dispatch logout action to clear the auth state and token
            store.dispatch(logout()); // Clear Redux state
            localStorage.removeItem('token'); // Clear token from localStorage

            // Use navigate to redirect to login
            const navigate = useNavigate();
            navigate('/login');

            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default API;