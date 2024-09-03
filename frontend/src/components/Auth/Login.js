import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    // Local state to manage email and password inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Extract authentication state from Redux store
    const { isAuthenticated, error, isLoading } = useSelector((state) => state.auth);

    // Redirect to the home page on successful login
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch the login action with the provided email and password
        dispatch(loginUser({ userEmail: email, userPassword: password }));
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            {/* Display error message if login fails */}
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* Submit button*/}
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
            <div className="mt-3">
                {/* Link to the signup page for users who aren't registered */}
                <p>Not registered? <Link to="/signup">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;