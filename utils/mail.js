import nodemailer from "nodemailer";
import "dotenv/config";
export const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export async function sendEmail(email, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: email,
      subject,
      text,
    });
    return info;
  } catch (error) {
    console.log("An error occurred when sending email", error);
  }
}
