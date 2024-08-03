import express from "express";
import {
  followController,
  getProfileController,
  getUserPostController,
  loginController,
  logoutController,
  signUpController,
  updateController,
} from "../controller/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getProfileController);
router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/user/:username", getUserPostController);
router.post("/follow/:id", protectRoute, followController);
router.put("/update/:id", protectRoute, updateController);

export default router;
