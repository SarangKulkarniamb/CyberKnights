import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE , WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";

dotenv.config();

const serverDomain = process.env.SERVER_DOMAIN;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL, 
    pass: process.env.GMAIL_PASSWORD 
  }
});

const sendEmail = async (email, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: subject,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendVerificationEmail = async (email, verificationCode) => {
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode);
  await sendEmail(email, "Verify your email", htmlContent);
};

export const sendWelcomeEmail = async (email, username) => {
  const htmlContent = WELCOME_EMAIL_TEMPLATE.replace("{username}" , username);
  await sendEmail(email, "Welcome to our Platform!", htmlContent);
};

export const sendPasswordResetEmail = async (email, resetPasswordToken) => {
  const resetURL = `${serverDomain}/api/auth/forgot-password/${resetPasswordToken}`;
  const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
  await sendEmail(email, "Password Reset Request", htmlContent);
};

export const passwordResetSuccessEmail = async (email) => {
  const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
  await sendEmail(email, "Password Reset Successful", htmlContent);
};
