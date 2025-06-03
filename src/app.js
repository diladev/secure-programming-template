const express = require("express");
const helmet = require("helmet"); // Week 3: Security Headers and HTTP Security
const cors = require("cors"); // Week 3: Cross-Origin Resource Sharing
const rateLimit = require("express-rate-limit"); // Week 5: Rate Limiting and Abuse Prevention
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const { connectDB } = require("./config/database");
const { requestLogger } = require("./middlewares/logger.middleware");
const authRoutes = require("./routes/auth.route");
const { errorHandler } = require("./middlewares/error.middleware");
// Week 5: Session Management
// IMPORTANT: Choose ONE authentication method - either JWT or Session
// const { sessionMiddleware, validateSession } = require("./middlewares/session.middleware");
require("dotenv").config();

const app = express();

// Week 2: Secure Database Configuration and Connection
// Initialize database
connectDB();

// Week 3: Security Headers and HTTP Security
// Comprehensive security headers configuration using Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  })
);

// Week 3: Cross-Origin Resource Sharing (CORS) Configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Week 4: Logging and Monitoring
// Request logging middleware
app.use(requestLogger);

app.use(express.json());

// Week 5: Authentication and Authorization
// IMPORTANT: If using session-based authentication, uncomment these lines
// app.use(sessionMiddleware);
// app.use("/api/auth", validateSession, authRoutes);

// If using JWT-based authentication, use this line instead
app.use("/api/auth", authRoutes);

// Week 6: API Documentation and Security
// Swagger documentation with security configurations
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Secure Programming App API",
  })
);

// Week 5: Rate Limiting and Abuse Prevention
// Global rate limiter for all routes
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Week 5: Specific rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use(globalLimiter);
app.use("/api/auth/login", loginLimiter);

// Week 4: Health Monitoring
// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Week 7: Error Handling and Security
// Global error handling middleware
app.use(errorHandler);

module.exports = app;
