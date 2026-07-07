const authorize = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Admins always allowed
    if (user.role === "Admin") return next();

    if (roles.length === 0) return next();

    if (!roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return next();
  };
};

export default authorize;
