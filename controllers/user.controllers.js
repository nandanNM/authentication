import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/mail.js";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        sucess: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        sucess: false,
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
        sucess: false,
      });
    }

    const token = crypto.randomBytes(64).toString("hex");
    newUser.verifyToken = token;
    await newUser.save();
    const emailText = `Please verify your email ID: ${process.env.BASE_URL}/api/v1/users/verify/${token}`;
    const emailRes = await sendEmail(email, "Verify your email ID", emailText);
    if (emailRes) {
      console.log("Email ", emailRes);
    }

    return res.status(200).json({
      message: "User created successfully. Please verify the email ID to login",
      sucess: true,
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      sucess: false,
    });
  }
};

const verifyUser = async (req, res) => {
  // get the token
  // find in db
  // set userVerified to true
  // clear token field
  // send response
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verifyToken: token,
    });
    if (!user) {
      return res.status(300).json({
        message: "Invalid token",
        success: false,
      });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    return res.status(200).json({
      message: "User verified successfully",
      success: true, // Fixed from sucess
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      success: false, // Fixed from sucess
    });
  }
};

const loginUser = async (req, res) => {
  // get user data
  // verify the user data
  // check if the user is verified, if not send verification email
  // create cookie
  // set the cookie
  // send success response
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not exist Please SignUp",
        success: false,
      });
    }
    if (!user.isVerified && user.verifyToken) {
      const emailText = `Please verify your email ID: ${process.env.BASE_URL}/api/v1/users/verify/${user.verifyToken}`;
      const emailRes = await sendEmail(
        email,
        "Verify your email ID",
        emailText
      );
      if (emailRes) {
        return res.status(300).json({
          message: "Your email not verify Please verified it then login",
          success: false,
        });
      }
    }
    const isCurrectPassword = await bcrypt.compare(password, user.password);
    if (!isCurrectPassword) {
      return res.status(400).json({
        message: "Wrong password",
        success: false,
      });
    }
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("session", jwtToken, cookieOptions);
    return res.status(200).json({
      message: "user login success",
      success: true,
      user: {
        id: user._id,
        email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const logOutUser = async (req, res) => {
  // fast find the cookie if it is exist remove it
  const { session } = req.cookies;
  // console.log("cookie", cookies);
  if (session) {
    res.clearCookie("session");
    return res.status(200).json({
      message: "logout success",
      success: true,
    });
  } else {
    return res.status(400).json({
      message: "already logout ",
      success: false,
    });
  }
};

const changePassword = async (req, res) => {
  //get data
  //valied data
  //find user
  //ganaratea token
  //save db
  // send forgetlink
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provied a valid email",
      success: false,
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not exist with this email",
        success: false,
      });
    }
    const token = crypto.randomBytes(64).toString("hex");
    user.forgotPasswordToken = token;
    await user.save();
    const emailText = `Please verify and change your password: ${process.env.BASE_URL}/api/v1/users/forgetpassword/${token}`;
    const emailRes = await sendEmail(email, "Forget your password", emailText);
    if (!emailRes) {
      return res.status(400).json({
        message: "Email not send pliss try ufter some tipme",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Password change email send pliss click the email",
      success: false,
      data: {
        email,
      },
    });
  } catch (error) {
    return res.status(200).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const changePasswordVerifay = async (req, res) => {
  //get the token and password
  // find the user
  // change ther password
  // send res
  const { token, password } = req.params;
  if (!token || !password) {
    return res.status(400).json({
      message: "All fields are required",
      sucess: false,
    });
  }
  try {
    const user = await User.findOne({ forgotPasswordToken: token });
    if (!user) {
      return res.status(400).json({
        message: "Token Invalid",
        sucess: false,
      });
    }
    user.password = password;
    user.forgotPasswordToken = null;
    user.save();
    return res.status(200).json({
      message: "Password change success",
      sucess: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      sucess: false,
    });
  }
};

const deleteUserAccount = async (req, res) => {
  const { session } = req.cookies;
  if (!session) {
    return res.status(400).json({
      message: "Session not exist",
      sucess: false,
    });
  }
  const { id, email } = jwt.decode(session);
  try {
    await User.findOneAndDelete({ email });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      sucess: false,
    });
  }
};

export {
  registerUser,
  verifyUser,
  loginUser,
  logOutUser,
  changePassword,
  changePasswordVerifay,
  deleteUserAccount,
};
