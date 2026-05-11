const crypto = require("crypto");
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

const generateOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};

module.exports = { isValidEmail, generateOTP };