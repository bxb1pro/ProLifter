const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT and user role
// Some code here inspired by https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
const verifyRole = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Get token from the header
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token

            const user = await User.findByPk(decodedToken.userID);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            console.error(error);
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = verifyRole;
