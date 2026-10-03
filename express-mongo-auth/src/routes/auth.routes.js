import express from "express";
import authController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);

export default router;
