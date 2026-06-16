const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  signUp,
  verifyOtp,
  resendOtp,
  signIn,
  getProfile,
  updateProfile,
  userList,
  forgatePass,
  resetPassword,
} = require("../controllers/authControllers");
const { authMiddleware, roleCheck } = require("../middlewares/authMiddleware");
const route = express.Router();

route.post("/signup", signUp);
route.post("/verify-email", verifyOtp);
route.post("/resend-otp", resendOtp);
route.post("/forgate-pass", forgatePass);
route.post("/reset-pass/:token", resetPassword);
route.post("/signin", signIn);
route.get("/getprofile", authMiddleware, getProfile);
route.put(
  "/updateprofile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile,
);
route.get(
  "/userlist",
  authMiddleware,
  roleCheck(["admin", "moderator"]),
  userList,
);
module.exports = route;