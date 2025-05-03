// Week 2: Data Validation and DTOs
// Input validation using DTOs to prevent injection and input misuse
const { registerSchema, loginSchema } = require("../dtos/user.dto");
// const { initializeFirebase } = require("../config/firebase");

// Week 4: Password Security
// Password hashing and salting implementation
const bcrypt = require("bcrypt");

// Week 10-11: Token-based Authentication
// IMPORTANT: Choose ONE authentication method
// For JWT-based authentication, use this:
const jwt = require("../utils/jwt");
// For Session-based authentication, comment out the JWT import above

const User = require("../models/user.model");

// Initialize Firebase Admin
// const admin = initializeFirebase();

// Week 4: Password Security
// Custom salt for additional security layer
const CUSTOM_SALT = process.env.CUSTOM_SALT || "your-custom-salt-here";

// Week 4: Password Security
// Helper function to hash password with custom salt
const hashPassword = async (password) => {
  // First hash with custom salt
  const saltedPassword = password + CUSTOM_SALT;
  // Then hash with bcrypt (which adds its own salt)
  return await bcrypt.hash(saltedPassword, 10);
};

// Week 4: Password Security
// Helper function to compare password with custom salt
const comparePassword = async (password, hashedPassword) => {
  const saltedPassword = password + CUSTOM_SALT;
  return await bcrypt.compare(saltedPassword, hashedPassword);
};

// Week 6-9: Application Security
// App Check token verification for additional security layer
const verifyAppCheckToken = async (token) => {
  // Temporarily bypass App Check verification
  return {
    isValid: true,
    appId: "development",
  };

  /*
  try {
    if (!token || typeof token !== "string") {
      return {
        isValid: false,
        error: "Invalid App Check token format",
      };
    }

    // Basic token format validation
    if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
      return {
        isValid: false,
        error: "Invalid token format",
      };
    }

    const decodedToken = await admin.appCheck().verifyToken(token);
    
    // Log successful verification (without sensitive data)
    console.log(`App Check verification successful for appId: ${decodedToken.appId}`);
    
    return {
      isValid: true,
      appId: decodedToken.appId,
      token: decodedToken,
    };
  } catch (error) {
    console.error("App Check verification error:", error.message);
    
    // Handle specific Firebase errors
    if (error.code === 'app-check/invalid-argument') {
      return {
        isValid: false,
        error: "Invalid token format",
      };
    }
    
    if (error.code === 'app-check/token-expired') {
      return {
        isValid: false,
        error: "Token has expired",
      };
    }

    return {
      isValid: false,
      error: "App verification failed",
    };
  }
  */
};

// Week 5: User Registration Security
// Registration handler with input validation and security measures
exports.register = async (req, res, next) => {
  try {
    // Week 2: Data Validation
    const { email, password } = registerSchema.parse(req.body);

    // Week 5: User Management
    // Check for existing user
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Week 4: Password Security
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Week 10-11: Authentication
    // IMPORTANT: Choose ONE authentication method
    // For JWT-based authentication:
    const token = jwt.sign({ userId: user.id });
    res.status(201).json({ token, user: { id: user.id, email: user.email } });

    // For Session-based authentication, comment out the JWT code above and use:
    // req.session.userId = user.id;
    // res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
};

// Week 5: User Login Security
exports.login = async (req, res, next) => {
  try {
    // Week 2: Data Validation
    const { email, password } = loginSchema.parse(req.body);

    // Week 5: User Authentication
    const user = await User.findOne({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Week 10-11: Authentication
    // IMPORTANT: Choose ONE authentication method
    // For JWT-based authentication:
    const token = jwt.sign({ userId: user.id });
    res.json({ token, user: { id: user.id, email: user.email } });

    // For Session-based authentication, comment out the JWT code above and use:
    // req.session.userId = user.id;
    // res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
};
