exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal server error ";
  res.status(statusCode).json({ error: errorMessage });
};
