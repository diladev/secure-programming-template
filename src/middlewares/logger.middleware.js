const winston = require("winston");

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Create a middleware function for request logging
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info(`${req.method} ${req.originalUrl} [STARTED]`, {
    headers: req.headers,
    body: req.body,
  });

  // Capture response data
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} [FINISHED] ${duration}ms`, {
      response: body,
    });
    return originalSend.call(this, body);
  };

  next();
};

module.exports = { logger, requestLogger };
