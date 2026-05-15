const jwt = require("jsonwebtoken");
const crypto = require("crypto");
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

const generateOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "2h" },
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "15d" },
  );
};

module.exports = {
  isValidEmail,
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
};