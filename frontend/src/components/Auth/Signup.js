import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearErrors } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { signupSuccess, error, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (signupSuccess) {
            navigate('/login');  // Redirect to login page after successful signup
        }
    }, [signupSuccess, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupUser({ userName, userEmail: email, userPassword: password }));
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            {error && <p className="text-danger">{typeof error === 'string' ? error : 'An unexpected error occurred'}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Register'}
                </button>
            </form>
            <div className="mt-3">
                <p>Already registered? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;