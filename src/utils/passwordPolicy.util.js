// Week 4: Password Security and Policies
const zxcvbn = require("zxcvbn");
const { logger } = require("../middlewares/logger.middleware");

// Password strength requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minStrength: 3, // 0-4 scale, 3 is strong
};

// Check if password meets all requirements
const validatePassword = (password) => {
  const errors = [];

  // Check length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  // Check uppercase
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Check lowercase
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Check numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Check special characters
  if (
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  }

  // Check password strength using zxcvbn
  const strength = zxcvbn(password);
  if (strength.score < PASSWORD_REQUIREMENTS.minStrength) {
    errors.push("Password is too weak. Try adding more complexity");
  }

  // Log password strength check
  logger.info(`Password strength check: ${strength.score}/4`);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate a secure random password
const generateSecurePassword = () => {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";

  // Ensure at least one of each required character type
  password += charset.match(/[A-Z]/)[0]; // Uppercase
  password += charset.match(/[a-z]/)[0]; // Lowercase
  password += charset.match(/[0-9]/)[0]; // Number
  password += charset.match(/[!@#$%^&*()_+]/)[0]; // Special char

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

module.exports = {
  validatePassword,
  generateSecurePassword,
};
