import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Middleware to protect routes by verifying JWT authentication, and fetching the user from the database.
// If the user is not logged in or the token is invalid, an error is thrown.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Token not provided.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Invalid token.');
    }

    // Fetch the user from the database using the ID from the decoded token
    // Exclude the password field for security reasons
    req.user = await User.findById(decodedToken.userId).select('-password');

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any errors to the next middleware (error handler)
    next(error);
  }
};

// Middleware to check if the user is an admin.
const admin = (req, res, next) => {
  try {
    // Check if the user is logged in and has admin privileges
    if (!req.user || !req.user.isAdmin) {
      res.statusCode = 401;
      throw new Error('Authorization failed: Not authorized as an admin.');
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any errors to the next middleware (error handler)
    next(error);
  }
};

export { protect, admin };
