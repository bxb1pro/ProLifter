import React from 'react';
import { useNavigate } from 'react-router-dom';

// Basic landing page with links to login and signup
const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <img 
          src="/images/landingpage.jpg" 
          alt="ProLifter"
          className="img-fluid"
          style={{ width: '100%', objectFit: 'cover', maxHeight: '300px' }}
        />
      </div>

      <div className="container text-center mt-5">
        <h1 className="mb-4">Welcome to ProLifter</h1>

        <div>
          <button className="btn btn-primary mr-3" onClick={handleLogin}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={handleSignup}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;