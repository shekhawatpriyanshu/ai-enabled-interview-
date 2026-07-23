/**
 * ======================================================
 * Role Based Authorization Middleware
 * ======================================================
 *
 * Usage:
 *
 * authorize("admin")
 *
 * authorize("super_admin")
 *
 * authorize("admin", "super_admin")
 *
 */

const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this resource.",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = authorize;