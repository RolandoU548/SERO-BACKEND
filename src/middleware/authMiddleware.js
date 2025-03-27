import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
  req.session = { user: null };

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, token no proporcionado" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
  } catch {}
  next();
};
