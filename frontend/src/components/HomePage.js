import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import './HomePage.css';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user); // Get user role from Redux state
  const role = user?.role || '';

  // Provide picture links to various components
  return (
    <div className="container text-center mt-5">
      {user && <h2>Hello, {user.userName}! Welcome to Your ProLifter Account</h2>}
      <div className="row justify-content-center mt-4">
        <div className="col-md-4 mb-4 d-flex justify-content-center">
          <Link to="/exercises" className="home-link">
            <img src="/images/exercises.jpg" alt="Exercises" className="img-fluid rounded" />
            <h5 className="mt-2">Exercises</h5>
          </Link>
        </div>
        <div className="col-md-4 mb-4 d-flex justify-content-center">
          <Link to="/preset-templates" className="home-link">
            <img src="/images/preset-templates.jpg" alt="Preset Templates" className="img-fluid rounded" />
            <h5 className="mt-2">Preset Templates</h5>
          </Link>
        </div>
        <div className="col-md-4 mb-4 d-flex justify-content-center">
          <Link to="/preset-workouts" className="home-link">
            <img src="/images/preset-workouts.jpg" alt="Preset Workouts" className="img-fluid rounded" />
            <h5 className="mt-2">Preset Workouts</h5>
          </Link>
        </div>
        {/* If role is user then provide these extra picture links */}
        {role === 'user' && (
          <>
            <div className="col-md-4 mb-4 d-flex justify-content-center">
              <Link to="/custom-templates" className="home-link">
                <img src="/images/custom-templates.jpg" alt="Custom Templates" className="img-fluid rounded" />
                <h5 className="mt-2">Custom Templates</h5>
              </Link>
            </div>
            <div className="col-md-4 mb-4 d-flex justify-content-center">
              <Link to="/custom-workouts" className="home-link">
                <img src="/images/custom-workouts.jpg" alt="Custom Workouts" className="img-fluid rounded" />
                <h5 className="mt-2">Custom Workouts</h5>
              </Link>
            </div>
            <div className="col-md-4 mb-4 d-flex justify-content-center">
              <Link to="/workout-logs" className="home-link">
                <img src="/images/workout-logs.jpg" alt="Workout Logs" className="img-fluid rounded" />
                <h5 className="mt-2">Workout Logs</h5>
              </Link>
            </div>
          </>
        )}
        <div className="col-md-4 mb-4 d-flex justify-content-center">
          <Link to="/account" className="home-link">
            <img src="/images/account.jpg" alt="Account" className="img-fluid rounded" />
            <h5 className="mt-2">
              <BsPerson /> Account
            </h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;