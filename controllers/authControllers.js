const { OTPMailTemp } = require("../helpers/emailTemplates");
const { mailSender } = require("../helpers/mailService");
const {
  isValidEmail,
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/utils");
const userSchema = require("../models/userSchema");

const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName)
      return res.status(400).send({ message: "FullName is required." });
    if (!email) return res.status(400).send({ message: "Email is required." });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Email is not valid." });
    if (!password)
      return res.status(400).send({ message: "Password is required." });

    const existEmail = await userSchema.findOne({ email });
    if (existEmail)
      return res.status(400).send({ message: "This email already exist." });
    const otp = generateOTP();
    const user = userSchema.create({
      fullName,
      email,
      password,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });
    mailSender({
      email,
      subject: "Verify your OTP",
      template: OTPMailTemp(otp),
    });
    res
      .status(200)
      .send({ message: "Registration successfully, verify your email" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!otp) return res.status(400).send({ message: "OTP Code is required" });
    const userData = await userSchema.findOneAndUpdate(
      { email, otp, otpExpiry: { $gt: Date.now() }, isVerified: false },
      {
        $set: {
          isVerified: true,
          otp: null,
          otpExpiry: null,
        },
      },
      {
        returnDocument: "after",
      },
    );
    if (!userData) {
      return res.status(400).send({ message: "Invalid Request" });
    }
    // res.redirect("clienturl/login")
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await userSchema.findOne({ email, isVerified: false });
    if (!userData) return res.status(400).send({ message: "Invalid Request" });

    const otp = generateOTP();
    userData.otp = otp;
    userData.otpExpiry = Date.now() + 5 * 60 * 1000;
    await userData.save();
    mailSender({
      email,
      subject: "Verify your OTP",
      template: OTPMailTemp(otp),
    });

    res.status(200).send({ message: "New OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const cookie_config = {
  httpOnly: false, // Not accessible by client-side JS
  secure: false, // Only sent over HTTPS
  // sameSite: 'Strict' // Only send for same-site requests
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userSchema.findOne({ email }).select("+password");

    if (!userData)
      return res.status(400).send({ message: "Invalid crediential" });
    if (userData.isVerified === false)
      return res.status(400).send({ message: "Email is not verified" });

    const matchPassword = await userData.comparePassword(password);
    if (!matchPassword)
      return res.status(400).send({ message: "Invalid crediential" });
    const accToken = generateAccessToken(userData);
    const refToken = generateRefreshToken(userData);
    res
      .status(200)
      .cookie("acc_tkn", accToken, cookie_config)
      .cookie("ref_tkn", refToken, cookie_config)
      .send({ message: "Login Successfylly" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

module.exports = { signUp, verifyOtp, resendOtp, signIn };