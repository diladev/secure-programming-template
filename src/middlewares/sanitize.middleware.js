// Week 3: Input Sanitization and XSS Prevention
const xss = require("xss");
const { sanitize } = require("express-validator");

// Sanitize middleware to clean user input
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    });
  }

  // Sanitize URL parameters
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    });
  }

  next();
};

module.exports = sanitizeInput;
