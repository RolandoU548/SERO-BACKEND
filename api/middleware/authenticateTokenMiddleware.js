import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Token must be a Bearer Token" });

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.session = { user: null };
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.session.user = data;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(403).json({ message: "Invalid token" });
    if (error.name === "TokenExpiredError")
      return res.status(403).json({ message: "Expired token" });
    next(error);
  }
};
