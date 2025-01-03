import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Protect route middleware
export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Payload:', decoded);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

// Admin-only route middleware
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next();
};
