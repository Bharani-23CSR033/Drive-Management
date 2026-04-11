const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    data: {},
    message: "Route not found",
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    data: {},
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFound, errorHandler };
