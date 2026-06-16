const { OTPMailTemp } = require("../helpers/emailTemplates");
const { mailSender } = require("../helpers/mailService");
const {
  isValidEmail,
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  uploadToCloudinary,
  destroyFromCloudinary,
  generateResetPassToken,
  hashResetToken,
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

const forgatePass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required." });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Email is not valid." });
    const existUser = await userSchema.findOne({ email });
    if (!existUser)
      return res.status(400).send({ message: "Email not found!" });

    // Generate reset password token
    const { resetToken, hashedToken } = generateResetPassToken();
    existUser.resetToken = hashedToken;
    existUser.resetTokenExpiry = Date.now() + 2 * 60 * 1000;
    existUser.save();

    const resetPassUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    console.log(resetPassUrl);

    // Send to mail
    // mailSender({
    //   email,
    //   subject: "Reset Password",
    //   template: OTPMailTemp(resetPassUrl),
    // });
    res.status(200).send({ message: "Check your email to set new password" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newpass } = req.body;
    const { token } = req.params;
    if (!newpass)
      return res.status(400).send({ message: "Password is required" });
    if (!token) return res.status(400).send({ message: "Invalid request" });

    const genHashedToken = hashResetToken(token);

    const userData = await userSchema.findOne({
      resetToken: genHashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!userData) return res.status(400).send({ message: "Invalid request" });

    userData.password = newpass;
    userData.resetToken = null;
    userData.resetTokenExpiry = null;
    userData.save();
    res.status(200).send({ message: "Password updated successfully" });
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

const getProfile = async (req, res) => {
  try {
    const profileData = await userSchema.findOne(
      { _id: req.user._id },
      { fullName: 1, email: 1, role: 1, avatar: 1, address: 1 },
    );
    if (!profileData)
      return res.status(400).send({ message: "Invalid request" });

    res.status(200).send(profileData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const updateProfile = async (req, res) => {
  const { fullName, address } = req.body;
  const avatar = req.file;
  try {
    const userData = await userSchema.findOne({ _id: req.user._id });
    if (!userData)
      return res.status(400).send({ message: "Something went wrong" });
    if (fullName && fullName.trim()) userData.fullName = fullName;
    if (address && address.trim()) userData.address = address;
    if (avatar) {
      try {
        const avatarUrl = await uploadToCloudinary({
          mimetype: avatar.mimetype,
          imgBuffer: avatar.buffer,
        });
        if (userData.avatar) destroyFromCloudinary(userData.avatar);
        userData.avatar = avatarUrl;
      } catch (error) {}
    }
    userData.save();
    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const userList = async (req, res) => {
  const { verified } = req.query || "";
  const { limit } = req.query || 10;
  const { page } = req.query || 1;
  const skip = limit * (page - 1);
  const filterQueries = {};

  if (verified && verified.toLowerCase() != "all") {
    filterQueries.isVerified = verified === "true";
  }

  try {
    const total = await userSchema.countDocuments();

    const users = await userSchema
      .find(filterQueries, {
        fullName: 1,
        email: 1,
        role: 1,
        avatar: 1,
        isVerified: 1,
      })
      .limit(limit)
      .skip(skip);
    const totalPage = total / limit;
    res.status(200).send({
      users,
      pagination: {
        limit,
        total,
        page,
        totalPage,
        hasNextpage: totalPage > page,
        hasPrevPage: totalPage < page,
      },
    });
  } catch (error) {}
};

module.exports = {
  signUp,
  verifyOtp,
  resendOtp,
  signIn,
  getProfile,
  updateProfile,
  userList,
  forgatePass,
  resetPassword,
};