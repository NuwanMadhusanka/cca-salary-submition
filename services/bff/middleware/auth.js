const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment variables');
  process.exit(1);
}

/**
 * Middleware to verify JWT token from Authorization header
 * Expects: Authorization: Bearer <token>
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request object
    // userId claim is set explicitly; fall back to sub (subject) for older tokens
    req.user = {
      userId: decoded.userId ?? parseInt(decoded.sub, 10),
      email: decoded.email ?? null,
    };

    console.log(`Authenticated user ID: ${req.user.userId}`);
    next();
    
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token verification failed.',
    });
  }
};

module.exports = { authenticateToken };
