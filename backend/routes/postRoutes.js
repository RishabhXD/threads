import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPostController,
  getPostController,
  deletePostController,
  likePostController,
  replyPostController,
  getFeedPosts,
} from "../controller/postController.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPostController);
router.post("/create", protectRoute, createPostController);
router.delete("/:id", protectRoute, deletePostController);
router.put("/like/:id", protectRoute, likePostController);
router.post("/reply/:id", protectRoute, replyPostController);

export default router;