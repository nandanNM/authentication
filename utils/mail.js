import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export async function sendEmail(email, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_SENDER_EMAIL,
      to: email,
      subject,
      text,
    });
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}
