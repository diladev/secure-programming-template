const admin = require("firebase-admin");

const initializeFirebase = () => {
  // Validate required environment variables
  const requiredEnvVars = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      console.log("Firebase Admin initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
      throw error;
    }
  }

  return admin;
};

module.exports = { initializeFirebase };
