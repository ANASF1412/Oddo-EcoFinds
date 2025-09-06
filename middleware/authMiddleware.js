const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies the JWT token from the Authorization header
 * Adds the decoded user data to the request object
 */
const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token.'
    });
  }
};

module.exports = authMiddleware;
