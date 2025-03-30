import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  req.session = { user: null };

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
