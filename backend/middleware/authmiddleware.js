import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js'; // Import your User model

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
      }

      req.user = user; // Attach the user object to the request if needed
      next();
    } catch (error) {
      console.error('Role Middleware Error:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

