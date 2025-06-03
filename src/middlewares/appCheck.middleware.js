const admin = require("firebase-admin");

const verifyAppCheck = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "App Check token is missing",
    });
  }

  try {
    // Verify the App Check token
    const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);

    // You can add additional verification here if needed
    // For example, checking if the app ID matches your expected app ID
    // if (appCheckClaims.app_id !== process.env.FIREBASE_APP_ID) {
    //   throw new Error('Invalid app ID');
    // }

    // Add the verified claims to the request object
    req.appCheckClaims = appCheckClaims;
    next();
  } catch (error) {
    console.error("App Check verification failed:", error);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid App Check token",
    });
  }
};

module.exports = { verifyAppCheck };
