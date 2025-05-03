const jwt = require("../utils/jwt");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
