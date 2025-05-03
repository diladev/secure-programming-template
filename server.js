// Week 1: Environment Configuration and Security
require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/config/database");
const { logger } = require("./src/middlewares/logger.middleware");

const PORT = process.env.PORT || 3000;

// Week 2: Server Configuration and Security
// Start the server with secure configuration
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Week 7: Graceful Shutdown and Resource Management
// Handle shutdown gracefully to prevent data loss and ensure proper cleanup
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully`);
  server.close(() => {
    sequelize.close().then(() => {
      logger.info("Database connection closed");
      process.exit(0);
    });
  });
};

// Handle different shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
