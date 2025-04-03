// este middleware se debe llamar solo en rutas protegidas por el authenticateTokenMiddleware

export const authenticateRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.session?.user?.role)
      return res.status(401).json({ message: "Not user role found" });
    if (allowedRoles.includes(req.session.user.role)) next();
    else
      return res.status(401).json({
        message: "Access denied. You do not have the required role",
      });
  };
};
