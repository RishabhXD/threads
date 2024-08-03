import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPostController = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Posted by and text is required", success: false });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ error: "User not found", success: false });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorized", success: false });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({
        error: "Text must be less than or equal to " + maxLength,
        success: false,
      });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const getPostController = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found", success: false });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found", success: false });
    }
    if (req.user._id.toString() !== post.postedBy.toString()) {
      return res
        .status(404)
        .json({ error: "Only owner can delete post", success: false });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const likePostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found", success: false });
    }

    const userLikedPost = post.likes.includes(userId);
    const username = req.user.username;
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res
        .status(200)
        .json({ message: `${username} unliked the post `, success: true });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      res
        .status(200)
        .json({ message: `${username} liked the post `, success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const replyPostController = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res
        .status(400)
        .json({ error: "Text is required", success: false });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found", success: false });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);

    await post.save();
    res
      .status(200)
      .json({ message: "Reply added successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};
