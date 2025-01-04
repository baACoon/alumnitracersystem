import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Directly attach the decoded user ID without checking the database
        req.user = { id: decoded.id }; 
        next();
    } catch (error) {
        console.error('Authorization error:', error.message);
        res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

/*Admin only access*/
export const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
};
