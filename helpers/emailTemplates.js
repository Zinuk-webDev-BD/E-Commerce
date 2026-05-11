const OTPMailTemp = (otp) => {
  return `<div style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" 
         style="max-width:600px; background-color:#ffffff; margin-top:30px; border-radius:8px; overflow:hidden;">
    <tr>
      <td align="center" style="background-color:#4CAF50; padding:20px;">
        <h2 style="color:#ffffff; margin:0;">Verify Your Email</h2>
      </td>
    </tr>
    <tr>
      <td style="padding:30px; color:#333333;">
        <p style="font-size:16px; margin:0 0 15px;">Hello,</p>
        <p style="font-size:16px; margin:0 0 20px;">
          Use the OTP below to complete your verification. This code is valid for a limited time.
        </p>
        <!-- OTP Box -->
        <div style="text-align:center; margin:30px 0;">
          <span style="display:inline-block; font-size:28px; letter-spacing:8px; 
                       background-color:#f2f2f2; padding:15px 25px; 
                       border-radius:6px; font-weight:bold; color:#333;">
            ${otp}
          </span>
        </div>
        <p style="font-size:14px; color:#777777; margin:20px 0;">
          If you did not request this, please ignore this email.
        </p>
        <p style="font-size:16px; margin-top:30px;">
          Thanks,<br>
          <strong>E-Commerce Team</strong>
        </p>
      </td>
    </tr>
  </table>
</div>`;
};

module.exports = { OTPMailTemp };