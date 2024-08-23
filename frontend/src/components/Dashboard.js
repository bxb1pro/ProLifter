import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h2>Dashboard</h2>
            {/* Add the Logout link */}
            <Link to="/logout">Logout</Link>
        </div>
    );
};

export default Dashboard;