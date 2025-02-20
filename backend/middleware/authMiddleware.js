import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    // Extract the token (remove 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};
