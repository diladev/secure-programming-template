// Week 5: Session Management and Security
// IMPORTANT: This is an alternative to JWT-based authentication
// DO NOT use both session and JWT authentication simultaneously
// Choose one authentication method based on your application needs

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const crypto = require("crypto");

// Generate secure session secret
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Configure Redis client for session storage
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect().catch(console.error);

// Session configuration
const sessionConfig = {
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || generateSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true, // Prevent client-side JavaScript access
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  name: "secureSessionId", // Custom session ID name
  rolling: true, // Refresh session on every response
};

// Session middleware
const sessionMiddleware = session(sessionConfig);

// Session validation middleware
const validateSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Session invalid or expired" });
  }
  next();
};

module.exports = {
  sessionMiddleware,
  validateSession,
};
