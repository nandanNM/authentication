import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/mail.js";
import "dotenv/config";

const registerUser = async (req, res) => {
  //get user data
  //validate user data
  // check user exists or not
  //create user
  // create token
  //save token in db
  //send email with the verification link
  // send response
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    if (!newUser) {
      return res.status(400).json({
        message: "User not created in DB",
      });
    }

    const token = crypto.randomBytes(64).toString("hex");
    newUser.verifyToken = token;
    await newUser.save();

    const emailText = `Please verify your email ID: ${process.env.BASE_URL}/api/v1/users/verify/${token}`;
    const emailRes = await sendEmail(email, "Verify your email ID", emailText);

    if (emailRes) {
      console.log("Email sent successfully", emailRes);
    }

    return res.status(200).json({
      message: "User created successfully. Please verify the email ID to login",
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

export { registerUser };
