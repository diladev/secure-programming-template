const { ZodError } = require("zod");
const { JsonWebTokenError } = require("jsonwebtoken");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle JWT errors
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  // Handle Sequelize errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: "error",
      message: "Duplicate entry",
      field: err.errors[0].path,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message;

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = { errorHandler };
