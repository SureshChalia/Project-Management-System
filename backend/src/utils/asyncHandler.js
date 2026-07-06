const asyncHandler = (fn) => {
  return (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((err) => {
      try {
        if (typeof next === "function") return next(err);
      } catch (e) {
        // fallthrough to safe response
      }

      try {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || "Internal Server Error" });
      } catch (e) {
       
        console.error("Failed to send error response:", e);
      }
    });
};

export default asyncHandler;