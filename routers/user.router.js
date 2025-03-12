import express from "express";
import {
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

export default router;
