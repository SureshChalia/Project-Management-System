export default (err, req, res, next) => {
  const status = err.statusCode || 500;
  console.error('[error.middleware] status=', status, 'message=', err.message);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};