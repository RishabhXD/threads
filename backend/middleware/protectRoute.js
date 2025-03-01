import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
    console.log("Error in protectRoute : " + error.message);
  }
};
