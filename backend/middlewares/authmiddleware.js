import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Decode JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hanapin ang user sa database
        const user = await User.findById(decoded.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found.' });
        }

        // Attach user data sa request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authorization error:', error.message);
        res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};
