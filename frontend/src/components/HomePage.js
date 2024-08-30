// src/components/HomePage.js

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
    <div>
      <h1>Welcome to Your Homepage</h1>
      {user && <p>Hello, {user.userName}!</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;