const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordEmail = async (email, name, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Saylani Microfinance Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #2c5f2d;">Welcome to Saylani Microfinance</h2>
            <p>Dear ${name},</p>
            <p>Your account has been created successfully. Please use the following credentials to log in:</p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${password}</p>
            </div>
            <p style="color: #d9534f;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            <p>Thank you for choosing Saylani Welfare's Qarze Hasana program.</p>
            <br>
            <p>Best regards,<br>Saylani Welfare Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendPasswordEmail };
