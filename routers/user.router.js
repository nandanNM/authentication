import express from "express";
import { registerUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/registar", registerUser);

export default router;
