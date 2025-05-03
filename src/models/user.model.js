const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// This Sequelize model prevents SQL Injection (Week 5) by avoiding raw queries and using ORM practices.
const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    tableName: "users", // Explicitly set table name
  }
);

module.exports = User;
