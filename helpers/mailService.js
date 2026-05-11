const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "zinuk758@gmail.com",
    pass: "",
  },
});

const mailSender = async ({ email, subject, template }) => {
  try {
    await transporter.sendMail({
      from: '"E-Commerce Team" <team@ecommerce.com>',
      to: email,
      subject: subject,
      html: template,
    });
  } catch (error) {
    console.log("Error while sending mail", error);
  }
};

module.exports = { mailSender };