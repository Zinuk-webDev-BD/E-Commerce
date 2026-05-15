const express = require("express");
const { signUp, verifyOtp, resendOtp, signIn } = require("../controllers/authControllers");
const route = express.Router();

route.post("/signup", signUp);
route.post("/verify-email", verifyOtp);
route.post("/resend-otp", resendOtp)
route.post("/signin", signIn)
module.exports = route;