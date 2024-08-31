import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality (if needed)
    // For now, just navigate to the login page
    navigate('/logout');
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to Your Homepage</h1>
      {user && <p className="lead">Hello, {user.userName}!</p>}
      <button className="btn btn-primary mt-3" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;