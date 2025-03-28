export const errorHandler = (err, req, res, next) => {
  console.error("Error interno del servidor:", err);
  res.status(500).json({ message: "Error interno del servidor" });
};
