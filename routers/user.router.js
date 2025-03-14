import express from "express";
import {
  changePassword,
  changePasswordVerifay,
  deleteUserAccount,
  getUser,
  loginUser,
  logOutUser,
  registerUser,
  verifyUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/registar", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.post("/forgetpassword", changePassword);
router.get("/forgetpassword/:token/:password", changePasswordVerifay);
router.delete("/delete", deleteUserAccount);
router.get("/getuser", getUser);

export default router;
