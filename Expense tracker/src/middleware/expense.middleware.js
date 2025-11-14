function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  const errorMessage = err.errorMessage || "Internal server error ";
  console.error(err);
  res.status(statusCode).json({ error: errorMessage });
}

module.exports = { errorHandler };
