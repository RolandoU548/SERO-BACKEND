export const errorHandler = (err, req, res, next) => {
  console.error("Intern server error:", err);
  res.status(500).json({ message: "Intern server error" });
};
