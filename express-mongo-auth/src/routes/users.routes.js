import express from "express";
import userController from "../controllers/UserController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", authenticate, authorize(["admin"]), userController.getAll);
router.get("/me", authenticate, authorize([]), userController.getMe);
router.put("/me", authenticate, authorize([]), userController.updateMe);
router.get("/:id", authenticate, authorize(["admin"]), userController.getById);

export default router;
