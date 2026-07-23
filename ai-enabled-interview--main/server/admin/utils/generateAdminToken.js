const jwt = require("jsonwebtoken");

const generateAdminToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

module.exports = generateAdminToken;