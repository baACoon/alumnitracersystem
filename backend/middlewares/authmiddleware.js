import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Not authorized, no token provided.' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token received:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
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
